import { AppBlock, events } from "@slflows/sdk/v1";
import {
  LambdaClient,
  ListFunctionUrlConfigsCommand,
} from "@aws-sdk/client-lambda";

const listFunctionUrlConfigs: AppBlock = {
  name: "List Function Url Configs",
  description:
    "Returns a list of Lambda function URLs for the specified function.",
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
        Marker: {
          name: "Marker",
          description:
            "Specify the pagination token that's returned by a previous request to retrieve the next page of results.",
          type: "string",
          required: false,
        },
        MaxItems: {
          name: "Max Items",
          description:
            "The maximum number of function URLs to return in the response.",
          type: "number",
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

        const command = new ListFunctionUrlConfigsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Function Url Configs Result",
      description: "Result from ListFunctionUrlConfigs operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          FunctionUrlConfigs: {
            type: "array",
            items: {
              type: "object",
              properties: {
                FunctionUrl: {
                  type: "string",
                },
                FunctionArn: {
                  type: "string",
                },
                CreationTime: {
                  type: "string",
                },
                LastModifiedTime: {
                  type: "string",
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
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    AllowMethods: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    AllowOrigins: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    ExposeHeaders: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    MaxAge: {
                      type: "number",
                    },
                  },
                  additionalProperties: false,
                },
                AuthType: {
                  type: "string",
                },
                InvokeMode: {
                  type: "string",
                },
              },
              required: [
                "FunctionUrl",
                "FunctionArn",
                "CreationTime",
                "LastModifiedTime",
                "AuthType",
              ],
              additionalProperties: false,
            },
            description: "A list of function URL configurations.",
          },
          NextMarker: {
            type: "string",
            description:
              "The pagination token that's included if more results are available.",
          },
        },
        required: ["FunctionUrlConfigs"],
      },
    },
  },
};

export default listFunctionUrlConfigs;
