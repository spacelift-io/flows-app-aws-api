import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, PutInventoryCommand } from "@aws-sdk/client-ssm";

const putInventory: AppBlock = {
  name: "Put Inventory",
  description:
    "Bulk update custom inventory items on one or more managed nodes.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        InstanceId: {
          name: "Instance Id",
          description:
            "An managed node ID where you want to add or update inventory items.",
          type: "string",
          required: true,
        },
        Items: {
          name: "Items",
          description:
            "The inventory items that you want to add or update on managed nodes.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                TypeName: {
                  type: "string",
                },
                SchemaVersion: {
                  type: "string",
                },
                CaptureTime: {
                  type: "string",
                },
                ContentHash: {
                  type: "string",
                },
                Content: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: {
                      type: "object",
                    },
                  },
                },
                Context: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                },
              },
              required: ["TypeName", "SchemaVersion", "CaptureTime"],
              additionalProperties: false,
            },
          },
          required: true,
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

        const command = new PutInventoryCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Inventory Result",
      description: "Result from PutInventory operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Message: {
            type: "string",
            description: "Information about the request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default putInventory;
