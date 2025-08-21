import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, PurchaseHostReservationCommand } from "@aws-sdk/client-ec2";

const purchaseHostReservation: AppBlock = {
  name: "Purchase Host Reservation",
  description:
    "Purchase a reservation with configurations that match those of your Dedicated Host.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ClientToken: {
          name: "Client Token",
          description:
            "Unique, case-sensitive identifier that you provide to ensure the idempotency of the request.",
          type: "string",
          required: false,
        },
        CurrencyCode: {
          name: "Currency Code",
          description:
            "The currency in which the totalUpfrontPrice, LimitPrice, and totalHourlyPrice amounts are specified.",
          type: "string",
          required: false,
        },
        HostIdSet: {
          name: "Host Id Set",
          description:
            "The IDs of the Dedicated Hosts with which the reservation will be associated.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: true,
        },
        LimitPrice: {
          name: "Limit Price",
          description:
            "The specified limit is checked against the total upfront cost of the reservation (calculated as the offering's upfront cost multiplied by the host count).",
          type: "string",
          required: false,
        },
        OfferingId: {
          name: "Offering Id",
          description: "The ID of the offering.",
          type: "string",
          required: true,
        },
        TagSpecifications: {
          name: "Tag Specifications",
          description:
            "The tags to apply to the Dedicated Host Reservation during purchase.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ResourceType: {
                  type: "string",
                },
                Tags: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Key: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Value: {
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

        const command = new PurchaseHostReservationCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Purchase Host Reservation Result",
      description: "Result from PurchaseHostReservation operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ClientToken: {
            type: "string",
            description:
              "Unique, case-sensitive identifier that you provide to ensure the idempotency of the request.",
          },
          CurrencyCode: {
            type: "string",
            description:
              "The currency in which the totalUpfrontPrice and totalHourlyPrice amounts are specified.",
          },
          Purchase: {
            type: "array",
            items: {
              type: "object",
              properties: {
                CurrencyCode: {
                  type: "string",
                },
                Duration: {
                  type: "number",
                },
                HostIdSet: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                HostReservationId: {
                  type: "string",
                },
                HourlyPrice: {
                  type: "string",
                },
                InstanceFamily: {
                  type: "string",
                },
                PaymentOption: {
                  type: "string",
                },
                UpfrontPrice: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "Describes the details of the purchase.",
          },
          TotalHourlyPrice: {
            type: "string",
            description:
              "The total hourly price of the reservation calculated per hour.",
          },
          TotalUpfrontPrice: {
            type: "string",
            description:
              "The total amount charged to your account when you purchase the reservation.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default purchaseHostReservation;
