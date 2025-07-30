import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, GetInventorySchemaCommand } from "@aws-sdk/client-ssm";

const getInventorySchema: AppBlock = {
  name: "Get Inventory Schema",
  description:
    "Return a list of inventory type names for the account, or return a list of attribute names for a specific Inventory item type.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TypeName: {
          name: "Type Name",
          description: "The type of inventory item to return.",
          type: "string",
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
        Aggregator: {
          name: "Aggregator",
          description: "Returns inventory schemas that support aggregation.",
          type: "boolean",
          required: false,
        },
        SubType: {
          name: "Sub Type",
          description:
            "Returns the sub-type schema for a specified inventory type.",
          type: "boolean",
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

        const command = new GetInventorySchemaCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Inventory Schema Result",
      description: "Result from GetInventorySchema operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Schemas: {
            type: "array",
            items: {
              type: "object",
              properties: {
                TypeName: {
                  type: "string",
                },
                Version: {
                  type: "string",
                },
                Attributes: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Name: {
                        type: "object",
                        additionalProperties: true,
                      },
                      DataType: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    required: ["Name", "DataType"],
                    additionalProperties: false,
                  },
                },
                DisplayName: {
                  type: "string",
                },
              },
              required: ["TypeName", "Attributes"],
              additionalProperties: false,
            },
            description: "Inventory schemas returned by the request.",
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

export default getInventorySchema;
