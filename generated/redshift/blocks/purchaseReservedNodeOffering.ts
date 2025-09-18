import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  PurchaseReservedNodeOfferingCommand,
} from "@aws-sdk/client-redshift";

const purchaseReservedNodeOffering: AppBlock = {
  name: "Purchase Reserved Node Offering",
  description: `Allows you to purchase reserved nodes.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ReservedNodeOfferingId: {
          name: "Reserved Node Offering Id",
          description:
            "The unique identifier of the reserved node offering you want to purchase.",
          type: "string",
          required: true,
        },
        NodeCount: {
          name: "Node Count",
          description:
            "The number of reserved nodes that you want to purchase.",
          type: "number",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new RedshiftClient({
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

        const command = new PurchaseReservedNodeOfferingCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Purchase Reserved Node Offering Result",
      description: "Result from PurchaseReservedNodeOffering operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ReservedNode: {
            type: "object",
            properties: {
              ReservedNodeId: {
                type: "string",
              },
              ReservedNodeOfferingId: {
                type: "string",
              },
              NodeType: {
                type: "string",
              },
              StartTime: {
                type: "string",
              },
              Duration: {
                type: "number",
              },
              FixedPrice: {
                type: "number",
              },
              UsagePrice: {
                type: "number",
              },
              CurrencyCode: {
                type: "string",
              },
              NodeCount: {
                type: "number",
              },
              State: {
                type: "string",
              },
              OfferingType: {
                type: "string",
              },
              RecurringCharges: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    RecurringChargeAmount: {
                      type: "number",
                    },
                    RecurringChargeFrequency: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              ReservedNodeOfferingType: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "Describes a reserved node.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default purchaseReservedNodeOffering;
