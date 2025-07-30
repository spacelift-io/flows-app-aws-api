import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, DeleteFleetsCommand } from "@aws-sdk/client-ec2";

const deleteFleets: AppBlock = {
  name: "Delete Fleets",
  description: "Deletes the specified EC2 Fleet request.",
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
        FleetIds: {
          name: "Fleet Ids",
          description: "The IDs of the EC2 Fleets.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: true,
        },
        TerminateInstances: {
          name: "Terminate Instances",
          description:
            "Indicates whether to terminate the associated instances when the EC2 Fleet is deleted.",
          type: "boolean",
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

        const command = new DeleteFleetsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Fleets Result",
      description: "Result from DeleteFleets operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          SuccessfulFleetDeletions: {
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
                FleetId: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "Information about the EC2 Fleets that are successfully deleted.",
          },
          UnsuccessfulFleetDeletions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Error: {
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
                FleetId: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "Information about the EC2 Fleets that are not successfully deleted.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteFleets;
