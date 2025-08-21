import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, DeleteInventoryCommand } from "@aws-sdk/client-ssm";

const deleteInventory: AppBlock = {
  name: "Delete Inventory",
  description:
    "Delete a custom inventory type or the data associated with a custom Inventory type.",
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
          description:
            "The name of the custom inventory type for which you want to delete either all previously collected data or the inventory type itself.",
          type: "string",
          required: true,
        },
        SchemaDeleteOption: {
          name: "Schema Delete Option",
          description:
            "Use the SchemaDeleteOption to delete a custom inventory type (schema).",
          type: "string",
          required: false,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Use this option to view a summary of the deletion request without deleting any data or the data type.",
          type: "boolean",
          required: false,
        },
        ClientToken: {
          name: "Client Token",
          description: "User-provided idempotency token.",
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

        const command = new DeleteInventoryCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Inventory Result",
      description: "Result from DeleteInventory operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DeletionId: {
            type: "string",
            description:
              "Every DeleteInventory operation is assigned a unique ID.",
          },
          TypeName: {
            type: "string",
            description:
              "The name of the inventory data type specified in the request.",
          },
          DeletionSummary: {
            type: "object",
            properties: {
              TotalCount: {
                type: "number",
              },
              RemainingCount: {
                type: "number",
              },
              SummaryItems: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Version: {
                      type: "string",
                    },
                    Count: {
                      type: "number",
                    },
                    RemainingCount: {
                      type: "number",
                    },
                  },
                  additionalProperties: false,
                },
              },
            },
            additionalProperties: false,
            description: "A summary of the delete operation.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteInventory;
