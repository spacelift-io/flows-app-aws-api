import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, GetInventoryCommand } from "@aws-sdk/client-ssm";

const getInventory: AppBlock = {
  name: "Get Inventory",
  description: "Query inventory information.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Filters: {
          name: "Filters",
          description: "One or more filters.",
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
            "Returns counts of inventory types based on one or more expressions.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Expression: {
                  type: "string",
                },
                Aggregators: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Expression: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Aggregators: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Groups: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                Groups: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Name: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Filters: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    required: ["Name", "Filters"],
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
          description: "The list of inventory item types to return.",
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
          description: "The token for the next set of items to return.",
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

        const command = new GetInventoryCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Inventory Result",
      description: "Result from GetInventory operation",
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
            description:
              "Collection of inventory entities such as a collection of managed node inventory.",
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

export default getInventory;
