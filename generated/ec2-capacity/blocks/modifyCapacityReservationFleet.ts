import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  ModifyCapacityReservationFleetCommand,
} from "@aws-sdk/client-ec2";

const modifyCapacityReservationFleet: AppBlock = {
  name: "Modify Capacity Reservation Fleet",
  description: "Modifies a Capacity Reservation Fleet.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        CapacityReservationFleetId: {
          name: "Capacity Reservation Fleet Id",
          description: "The ID of the Capacity Reservation Fleet to modify.",
          type: "string",
          required: true,
        },
        TotalTargetCapacity: {
          name: "Total Target Capacity",
          description:
            "The total number of capacity units to be reserved by the Capacity Reservation Fleet.",
          type: "number",
          required: false,
        },
        EndDate: {
          name: "End Date",
          description:
            "The date and time at which the Capacity Reservation Fleet expires.",
          type: "string",
          required: false,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the action, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
        },
        RemoveEndDate: {
          name: "Remove End Date",
          description:
            "Indicates whether to remove the end date from the Capacity Reservation Fleet.",
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

        const command = new ModifyCapacityReservationFleetCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Capacity Reservation Fleet Result",
      description: "Result from ModifyCapacityReservationFleet operation",
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

export default modifyCapacityReservationFleet;
