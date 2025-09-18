import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  GetReservedNodeExchangeOfferingsCommand,
} from "@aws-sdk/client-redshift";

const getReservedNodeExchangeOfferings: AppBlock = {
  name: "Get Reserved Node Exchange Offerings",
  description: `Returns an array of DC2 ReservedNodeOfferings that matches the payment type, term, and usage price of the given DC1 reserved node.`,
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
            "A string representing the node identifier for the DC1 Reserved Node to be exchanged.",
          type: "string",
          required: true,
        },
        MaxRecords: {
          name: "Max Records",
          description:
            "An integer setting the maximum number of ReservedNodeOfferings to retrieve.",
          type: "number",
          required: false,
        },
        Marker: {
          name: "Marker",
          description:
            "A value that indicates the starting point for the next set of ReservedNodeOfferings.",
          type: "string",
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

        const command = new GetReservedNodeExchangeOfferingsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Reserved Node Exchange Offerings Result",
      description: "Result from GetReservedNodeExchangeOfferings operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Marker: {
            type: "string",
            description:
              "An optional parameter that specifies the starting point for returning a set of response records.",
          },
          ReservedNodeOfferings: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ReservedNodeOfferingId: {
                  type: "string",
                },
                NodeType: {
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
                OfferingType: {
                  type: "string",
                },
                RecurringCharges: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      RecurringChargeAmount: {
                        type: "object",
                        additionalProperties: true,
                      },
                      RecurringChargeFrequency: {
                        type: "object",
                        additionalProperties: true,
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
            },
            description: "Returns an array of ReservedNodeOffering objects.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getReservedNodeExchangeOfferings;
