import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  GetReservedInstancesExchangeQuoteCommand,
} from "@aws-sdk/client-ec2";

const getReservedInstancesExchangeQuote: AppBlock = {
  name: "Get Reserved Instances Exchange Quote",
  description:
    "Returns a quote and exchange information for exchanging one or more specified Convertible Reserved Instances for a new Convertible Reserved Instance.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the action, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
        },
        ReservedInstanceIds: {
          name: "Reserved Instance Ids",
          description:
            "The IDs of the Convertible Reserved Instances to exchange.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: true,
        },
        TargetConfigurations: {
          name: "Target Configurations",
          description:
            "The configuration of the target Convertible Reserved Instance to exchange for your current Convertible Reserved Instances.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                InstanceCount: {
                  type: "number",
                },
                OfferingId: {
                  type: "string",
                },
              },
              required: ["OfferingId"],
              additionalProperties: false,
            },
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new EC2Client({
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

        const command = new GetReservedInstancesExchangeQuoteCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Reserved Instances Exchange Quote Result",
      description: "Result from GetReservedInstancesExchangeQuote operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          CurrencyCode: {
            type: "string",
            description: "The currency of the transaction.",
          },
          IsValidExchange: {
            type: "boolean",
            description: "If true, the exchange is valid.",
          },
          OutputReservedInstancesWillExpireAt: {
            type: "string",
            description: "The new end date of the reservation term.",
          },
          PaymentDue: {
            type: "string",
            description: "The total true upfront charge for the exchange.",
          },
          ReservedInstanceValueRollup: {
            type: "object",
            properties: {
              HourlyPrice: {
                type: "string",
              },
              RemainingTotalValue: {
                type: "string",
              },
              RemainingUpfrontValue: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "The cost associated with the Reserved Instance.",
          },
          ReservedInstanceValueSet: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ReservationValue: {
                  type: "object",
                  properties: {
                    HourlyPrice: {
                      type: "string",
                    },
                    RemainingTotalValue: {
                      type: "string",
                    },
                    RemainingUpfrontValue: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                ReservedInstanceId: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "The configuration of your Convertible Reserved Instances.",
          },
          TargetConfigurationValueRollup: {
            type: "object",
            properties: {
              HourlyPrice: {
                type: "string",
              },
              RemainingTotalValue: {
                type: "string",
              },
              RemainingUpfrontValue: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "The cost associated with the Reserved Instance.",
          },
          TargetConfigurationValueSet: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ReservationValue: {
                  type: "object",
                  properties: {
                    HourlyPrice: {
                      type: "string",
                    },
                    RemainingTotalValue: {
                      type: "string",
                    },
                    RemainingUpfrontValue: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                TargetConfiguration: {
                  type: "object",
                  properties: {
                    InstanceCount: {
                      type: "number",
                    },
                    OfferingId: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              additionalProperties: false,
            },
            description:
              "The values of the target Convertible Reserved Instances.",
          },
          ValidationFailureReason: {
            type: "string",
            description:
              "Describes the reason why the exchange cannot be completed.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getReservedInstancesExchangeQuote;
