import { AppBlock, events } from "@slflows/sdk/v1";
import {
  LambdaClient,
  UpdateFunctionEventInvokeConfigCommand,
} from "@aws-sdk/client-lambda";

const updateFunctionEventInvokeConfig: AppBlock = {
  name: "Update Function Event Invoke Config",
  description:
    "Updates the configuration for asynchronous invocation for a function, version, or alias.",
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
          description:
            "The name or ARN of the Lambda function, version, or alias.",
          type: "string",
          required: true,
        },
        Qualifier: {
          name: "Qualifier",
          description: "A version number or alias name.",
          type: "string",
          required: false,
        },
        MaximumRetryAttempts: {
          name: "Maximum Retry Attempts",
          description:
            "The maximum number of times to retry when the function returns an error.",
          type: "number",
          required: false,
        },
        MaximumEventAgeInSeconds: {
          name: "Maximum Event Age In Seconds",
          description:
            "The maximum age of a request that Lambda sends to a function for processing.",
          type: "number",
          required: false,
        },
        DestinationConfig: {
          name: "Destination Config",
          description:
            "A destination for events after they have been sent to a function for processing.",
          type: {
            type: "object",
            properties: {
              OnSuccess: {
                type: "object",
                properties: {
                  Destination: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              OnFailure: {
                type: "object",
                properties: {
                  Destination: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
            },
            additionalProperties: false,
          },
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

        const command = new UpdateFunctionEventInvokeConfigCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Function Event Invoke Config Result",
      description: "Result from UpdateFunctionEventInvokeConfig operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          LastModified: {
            type: "string",
            description:
              "The date and time that the configuration was last updated.",
          },
          FunctionArn: {
            type: "string",
            description: "The Amazon Resource Name (ARN) of the function.",
          },
          MaximumRetryAttempts: {
            type: "number",
            description:
              "The maximum number of times to retry when the function returns an error.",
          },
          MaximumEventAgeInSeconds: {
            type: "number",
            description:
              "The maximum age of a request that Lambda sends to a function for processing.",
          },
          DestinationConfig: {
            type: "object",
            properties: {
              OnSuccess: {
                type: "object",
                properties: {
                  Destination: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              OnFailure: {
                type: "object",
                properties: {
                  Destination: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
            },
            additionalProperties: false,
            description:
              "A destination for events after they have been sent to a function for processing.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateFunctionEventInvokeConfig;
