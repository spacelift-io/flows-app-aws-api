import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  GetHostReservationPurchasePreviewCommand,
} from "@aws-sdk/client-ec2";

const getHostReservationPurchasePreview: AppBlock = {
  name: "Get Host Reservation Purchase Preview",
  description:
    "Preview a reservation purchase with configurations that match those of your Dedicated Host.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        HostIdSet: {
          name: "Host Id Set",
          description:
            "The IDs of the Dedicated Hosts with which the reservation is associated.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: true,
        },
        OfferingId: {
          name: "Offering Id",
          description: "The offering ID of the reservation.",
          type: "string",
          required: true,
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
        });

        const command = new GetHostReservationPurchasePreviewCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Host Reservation Purchase Preview Result",
      description: "Result from GetHostReservationPurchasePreview operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
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
            description:
              "The purchase information of the Dedicated Host reservation and the Dedicated Hosts associated with it.",
          },
          TotalHourlyPrice: {
            type: "string",
            description:
              "The potential total hourly price of the reservation per hour.",
          },
          TotalUpfrontPrice: {
            type: "string",
            description: "The potential total upfront price.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getHostReservationPurchasePreview;
