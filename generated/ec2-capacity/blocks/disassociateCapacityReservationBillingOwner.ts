import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DisassociateCapacityReservationBillingOwnerCommand,
} from "@aws-sdk/client-ec2";

const disassociateCapacityReservationBillingOwner: AppBlock = {
  name: "Disassociate Capacity Reservation Billing Owner",
  description:
    "Cancels a pending request to assign billing of the unused capacity of a Capacity Reservation to a consumer account, or revokes a request that has already been accepted.",
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
        CapacityReservationId: {
          name: "Capacity Reservation Id",
          description: "The ID of the Capacity Reservation.",
          type: "string",
          required: true,
        },
        UnusedReservationBillingOwnerId: {
          name: "Unused Reservation Billing Owner Id",
          description:
            "The ID of the consumer account to which the request was sent.",
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

        const command = new DisassociateCapacityReservationBillingOwnerCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Disassociate Capacity Reservation Billing Owner Result",
      description:
        "Result from DisassociateCapacityReservationBillingOwner operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Return: {
            type: "boolean",
            description:
              "Returns true if the request succeeds; otherwise, it returns an error.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default disassociateCapacityReservationBillingOwner;
