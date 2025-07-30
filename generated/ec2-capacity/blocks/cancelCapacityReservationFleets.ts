import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  CancelCapacityReservationFleetsCommand,
} from "@aws-sdk/client-ec2";

const cancelCapacityReservationFleets: AppBlock = {
  name: "Cancel Capacity Reservation Fleets",
  description: "Cancels one or more Capacity Reservation Fleets.",
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
        CapacityReservationFleetIds: {
          name: "Capacity Reservation Fleet Ids",
          description: "The IDs of the Capacity Reservation Fleets to cancel.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
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

        const command = new CancelCapacityReservationFleetsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Cancel Capacity Reservation Fleets Result",
      description: "Result from CancelCapacityReservationFleets operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          SuccessfulFleetCancellations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                CurrentFleetState: {
                  type: "string",
                },
                PreviousFleetState: {
                  type: "string",
                },
                CapacityReservationFleetId: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "Information about the Capacity Reservation Fleets that were successfully cancelled.",
          },
          FailedFleetCancellations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                CapacityReservationFleetId: {
                  type: "string",
                },
                CancelCapacityReservationFleetError: {
                  type: "object",
                  properties: {
                    Code: {
                      type: "string",
                    },
                    Message: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              additionalProperties: false,
            },
            description:
              "Information about the Capacity Reservation Fleets that could not be cancelled.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default cancelCapacityReservationFleets;
