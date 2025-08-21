import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, GetParameterHistoryCommand } from "@aws-sdk/client-ssm";

const getParameterHistory: AppBlock = {
  name: "Get Parameter History",
  description: "Retrieves the history of all changes to a parameter.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Name: {
          name: "Name",
          description:
            "The name or Amazon Resource Name (ARN) of the parameter for which you want to review history.",
          type: "string",
          required: true,
        },
        WithDecryption: {
          name: "With Decryption",
          description: "Return decrypted values for secure string parameters.",
          type: "boolean",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description: "The maximum number of items to return for this call.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token for the next set of items to return.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new SSMClient({
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

        const command = new GetParameterHistoryCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Parameter History Result",
      description: "Result from GetParameterHistory operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Parameters: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: {
                  type: "string",
                },
                Type: {
                  type: "string",
                },
                KeyId: {
                  type: "string",
                },
                LastModifiedDate: {
                  type: "string",
                },
                LastModifiedUser: {
                  type: "string",
                },
                Description: {
                  type: "string",
                },
                Value: {
                  type: "string",
                },
                AllowedPattern: {
                  type: "string",
                },
                Version: {
                  type: "number",
                },
                Labels: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                Tier: {
                  type: "string",
                },
                Policies: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      PolicyText: {
                        type: "object",
                        additionalProperties: true,
                      },
                      PolicyType: {
                        type: "object",
                        additionalProperties: true,
                      },
                      PolicyStatus: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                DataType: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "A list of parameters returned by the request.",
          },
          NextToken: {
            type: "string",
            description:
              "The token to use when requesting the next set of items.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getParameterHistory;
