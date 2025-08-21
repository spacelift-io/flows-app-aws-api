import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  PurchaseCapacityBlockExtensionCommand,
} from "@aws-sdk/client-ec2";

const purchaseCapacityBlockExtension: AppBlock = {
  name: "Purchase Capacity Block Extension",
  description:
    "Purchase the Capacity Block extension for use with your account.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        CapacityBlockExtensionOfferingId: {
          name: "Capacity Block Extension Offering Id",
          description:
            "The ID of the Capacity Block extension offering to purchase.",
          type: "string",
          required: true,
        },
        CapacityReservationId: {
          name: "Capacity Reservation Id",
          description: "The ID of the Capacity reservation to be extended.",
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

        const command = new PurchaseCapacityBlockExtensionCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Purchase Capacity Block Extension Result",
      description: "Result from PurchaseCapacityBlockExtension operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          CapacityBlockExtensions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                CapacityReservationId: {
                  type: "string",
                },
                InstanceType: {
                  type: "string",
                },
                InstanceCount: {
                  type: "number",
                },
                AvailabilityZone: {
                  type: "string",
                },
                AvailabilityZoneId: {
                  type: "string",
                },
                CapacityBlockExtensionOfferingId: {
                  type: "string",
                },
                CapacityBlockExtensionDurationHours: {
                  type: "number",
                },
                CapacityBlockExtensionStatus: {
                  type: "string",
                },
                CapacityBlockExtensionPurchaseDate: {
                  type: "string",
                },
                CapacityBlockExtensionStartDate: {
                  type: "string",
                },
                CapacityBlockExtensionEndDate: {
                  type: "string",
                },
                UpfrontFee: {
                  type: "string",
                },
                CurrencyCode: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "The purchased Capacity Block extensions.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default purchaseCapacityBlockExtension;
