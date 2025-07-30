import { AppBlock, events } from "@slflows/sdk/v1";
import {
  LambdaClient,
  UpdateFunctionUrlConfigCommand,
} from "@aws-sdk/client-lambda";

const updateFunctionUrlConfig: AppBlock = {
  name: "Update Function Url Config",
  description: "Updates the configuration for a Lambda function URL.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        FunctionName: {
          name: "Function Name",
          description: "The name or ARN of the Lambda function.",
          type: "string",
          required: true,
        },
        Qualifier: {
          name: "Qualifier",
          description: "The alias name.",
          type: "string",
          required: false,
        },
        AuthType: {
          name: "Auth Type",
          description:
            "The type of authentication that your function URL uses.",
          type: "string",
          required: false,
        },
        Cors: {
          name: "Cors",
          description:
            "The cross-origin resource sharing (CORS) settings for your function URL.",
          type: {
            type: "object",
            properties: {
              AllowCredentials: {
                type: "boolean",
              },
              AllowHeaders: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              AllowMethods: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              AllowOrigins: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              ExposeHeaders: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              MaxAge: {
                type: "number",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        InvokeMode: {
          name: "Invoke Mode",
          description:
            "Use one of the following options: BUFFERED – This is the default option.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new LambdaClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new UpdateFunctionUrlConfigCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Function Url Config Result",
      description: "Result from UpdateFunctionUrlConfig operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          FunctionUrl: {
            type: "string",
            description: "The HTTP URL endpoint for your function.",
          },
          FunctionArn: {
            type: "string",
            description: "The Amazon Resource Name (ARN) of your function.",
          },
          AuthType: {
            type: "string",
            description:
              "The type of authentication that your function URL uses.",
          },
          Cors: {
            type: "object",
            properties: {
              AllowCredentials: {
                type: "boolean",
              },
              AllowHeaders: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              AllowMethods: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              AllowOrigins: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              ExposeHeaders: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              MaxAge: {
                type: "number",
              },
            },
            additionalProperties: false,
            description:
              "The cross-origin resource sharing (CORS) settings for your function URL.",
          },
          CreationTime: {
            type: "string",
            description:
              "When the function URL was created, in ISO-8601 format (YYYY-MM-DDThh:mm:ss.",
          },
          LastModifiedTime: {
            type: "string",
            description:
              "When the function URL configuration was last updated, in ISO-8601 format (YYYY-MM-DDThh:mm:ss.",
          },
          InvokeMode: {
            type: "string",
            description:
              "Use one of the following options: BUFFERED – This is the default option.",
          },
        },
        required: [
          "FunctionUrl",
          "FunctionArn",
          "AuthType",
          "CreationTime",
          "LastModifiedTime",
        ],
      },
    },
  },
};

export default updateFunctionUrlConfig;
