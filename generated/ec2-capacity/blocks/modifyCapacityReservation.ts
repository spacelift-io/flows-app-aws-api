import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  ModifyCapacityReservationCommand,
} from "@aws-sdk/client-ec2";

const modifyCapacityReservation: AppBlock = {
  name: "Modify Capacity Reservation",
  description:
    "Modifies a Capacity Reservation's capacity, instance eligibility, and the conditions under which it is to be released.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        CapacityReservationId: {
          name: "Capacity Reservation Id",
          description: "The ID of the Capacity Reservation.",
          type: "string",
          required: true,
        },
        InstanceCount: {
          name: "Instance Count",
          description: "The number of instances for which to reserve capacity.",
          type: "number",
          required: false,
        },
        EndDate: {
          name: "End Date",
          description:
            "The date and time at which the Capacity Reservation expires.",
          type: "string",
          required: false,
        },
        EndDateType: {
          name: "End Date Type",
          description:
            "Indicates the way in which the Capacity Reservation ends.",
          type: "string",
          required: false,
        },
        Accept: {
          name: "Accept",
          description: "Reserved.",
          type: "boolean",
          required: false,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the action, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
        },
        AdditionalInfo: {
          name: "Additional Info",
          description: "Reserved for future use.",
          type: "string",
          required: false,
        },
        InstanceMatchCriteria: {
          name: "Instance Match Criteria",
          description:
            "The matching criteria (instance eligibility) that you want to use in the modified Capacity Reservation.",
          type: "string",
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

        const command = new ModifyCapacityReservationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Capacity Reservation Result",
      description: "Result from ModifyCapacityReservation operation",
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

export default modifyCapacityReservation;
