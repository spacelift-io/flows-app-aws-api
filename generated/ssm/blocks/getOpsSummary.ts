import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, GetOpsSummaryCommand } from "@aws-sdk/client-ssm";

const getOpsSummary: AppBlock = {
  name: "Get Ops Summary",
  description:
    "View a summary of operations metadata (OpsData) based on specified filters and aggregators.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        SyncName: {
          name: "Sync Name",
          description: "Specify the name of a resource data sync to get.",
          type: "string",
          required: false,
        },
        Filters: {
          name: "Filters",
          description:
            "Optional filters used to scope down the returned OpsData.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Key: {
                  type: "string",
                },
                Values: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                Type: {
                  type: "string",
                },
              },
              required: ["Key", "Values"],
              additionalProperties: false,
            },
          },
          required: false,
        },
        Aggregators: {
          name: "Aggregators",
          description:
            "Optional aggregators that return counts of OpsData based on one or more expressions.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                AggregatorType: {
                  type: "string",
                },
                TypeName: {
                  type: "string",
                },
                AttributeName: {
                  type: "string",
                },
                Values: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                },
                Filters: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Key: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Values: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Type: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    required: ["Key", "Values"],
                    additionalProperties: false,
                  },
                },
                Aggregators: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      AggregatorType: {
                        type: "object",
                        additionalProperties: true,
                      },
                      TypeName: {
                        type: "object",
                        additionalProperties: true,
                      },
                      AttributeName: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Values: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Filters: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Aggregators: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
              },
              additionalProperties: false,
            },
          },
          required: false,
        },
        ResultAttributes: {
          name: "Result Attributes",
          description: "The OpsData data type to return.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                TypeName: {
                  type: "string",
                },
              },
              required: ["TypeName"],
              additionalProperties: false,
            },
          },
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "A token to start the list.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description: "The maximum number of items to return for this call.",
          type: "number",
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
        });

        const command = new GetOpsSummaryCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Ops Summary Result",
      description: "Result from GetOpsSummary operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Entities: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Id: {
                  type: "string",
                },
                Data: {
                  type: "object",
                  additionalProperties: {
                    type: "object",
                  },
                },
              },
              additionalProperties: false,
            },
            description: "The list of aggregated details and filtered OpsData.",
          },
          NextToken: {
            type: "string",
            description: "The token for the next set of items to return.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getOpsSummary;
