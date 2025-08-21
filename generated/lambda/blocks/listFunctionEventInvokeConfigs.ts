import { AppBlock, events } from "@slflows/sdk/v1";
import {
  LambdaClient,
  ListFunctionEventInvokeConfigsCommand,
} from "@aws-sdk/client-lambda";

const listFunctionEventInvokeConfigs: AppBlock = {
  name: "List Function Event Invoke Configs",
  description:
    "Retrieves a list of configurations for asynchronous invocation for a function.",
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
          description: "The maximum number of configurations to return.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new ListFunctionEventInvokeConfigsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Function Event Invoke Configs Result",
      description: "Result from ListFunctionEventInvokeConfigs operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          FunctionEventInvokeConfigs: {
            type: "array",
            items: {
              type: "object",
              properties: {
                LastModified: {
                  type: "string",
                },
                FunctionArn: {
                  type: "string",
                },
                MaximumRetryAttempts: {
                  type: "number",
                },
                MaximumEventAgeInSeconds: {
                  type: "number",
                },
                DestinationConfig: {
                  type: "object",
                  properties: {
                    OnSuccess: {
                      type: "object",
                      properties: {
                        Destination: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                    OnFailure: {
                      type: "object",
                      properties: {
                        Destination: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                  additionalProperties: false,
                },
              },
              additionalProperties: false,
            },
            description: "A list of configurations.",
          },
          NextMarker: {
            type: "string",
            description:
              "The pagination token that's included if more results are available.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listFunctionEventInvokeConfigs;
