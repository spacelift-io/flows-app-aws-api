import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DisableFastSnapshotRestoresCommand,
} from "@aws-sdk/client-ec2";

const disableFastSnapshotRestores: AppBlock = {
  name: "Disable Fast Snapshot Restores",
  description:
    "Disables fast snapshot restores for the specified snapshots in the specified Availability Zones.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        AvailabilityZones: {
          name: "Availability Zones",
          description: "One or more Availability Zones.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: true,
        },
        SourceSnapshotIds: {
          name: "Source Snapshot Ids",
          description: "The IDs of one or more snapshots.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
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
        });

        const command = new DisableFastSnapshotRestoresCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Disable Fast Snapshot Restores Result",
      description: "Result from DisableFastSnapshotRestores operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Successful: {
            type: "array",
            items: {
              type: "object",
              properties: {
                SnapshotId: {
                  type: "string",
                },
                AvailabilityZone: {
                  type: "string",
                },
                State: {
                  type: "string",
                },
                StateTransitionReason: {
                  type: "string",
                },
                OwnerId: {
                  type: "string",
                },
                OwnerAlias: {
                  type: "string",
                },
                EnablingTime: {
                  type: "string",
                },
                OptimizingTime: {
                  type: "string",
                },
                EnabledTime: {
                  type: "string",
                },
                DisablingTime: {
                  type: "string",
                },
                DisabledTime: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "Information about the snapshots for which fast snapshot restores were successfully disabled.",
          },
          Unsuccessful: {
            type: "array",
            items: {
              type: "object",
              properties: {
                SnapshotId: {
                  type: "string",
                },
                FastSnapshotRestoreStateErrors: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      AvailabilityZone: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Error: {
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
            description:
              "Information about the snapshots for which fast snapshot restores could not be disabled.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default disableFastSnapshotRestores;
