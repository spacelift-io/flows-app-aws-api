import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  AcceptReservedNodeExchangeCommand,
} from "@aws-sdk/client-redshift";

const acceptReservedNodeExchange: AppBlock = {
  name: "Accept Reserved Node Exchange",
  description: `Exchanges a DC1 Reserved Node for a DC2 Reserved Node with no changes to the configuration (term, payment type, or number of nodes) and no additional costs.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ReservedNodeId: {
          name: "Reserved Node Id",
          description:
            "A string representing the node identifier of the DC1 Reserved Node to be exchanged.",
          type: "string",
          required: true,
        },
        TargetReservedNodeOfferingId: {
          name: "Target Reserved Node Offering Id",
          description:
            "The unique identifier of the DC2 Reserved Node offering to be used for the exchange.",
          type: "string",
          required: true,
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

        const command = new AcceptReservedNodeExchangeCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Accept Reserved Node Exchange Result",
      description: "Result from AcceptReservedNodeExchange operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ExchangedReservedNode: {
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
            description: "",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default acceptReservedNodeExchange;
