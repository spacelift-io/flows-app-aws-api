import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  DescribeSnapshotSchedulesCommand,
} from "@aws-sdk/client-redshift";

const describeSnapshotSchedules: AppBlock = {
  name: "Describe Snapshot Schedules",
  description: `Returns a list of snapshot schedules.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ClusterIdentifier: {
          name: "Cluster Identifier",
          description:
            "The unique identifier for the cluster whose snapshot schedules you want to view.",
          type: "string",
          required: false,
        },
        ScheduleIdentifier: {
          name: "Schedule Identifier",
          description: "A unique identifier for a snapshot schedule.",
          type: "string",
          required: false,
        },
        TagKeys: {
          name: "Tag Keys",
          description: "The key value for a snapshot schedule tag.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        TagValues: {
          name: "Tag Values",
          description:
            "The value corresponding to the key of the snapshot schedule tag.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        Marker: {
          name: "Marker",
          description:
            "A value that indicates the starting point for the next set of response records in a subsequent request.",
          type: "string",
          required: false,
        },
        MaxRecords: {
          name: "Max Records",
          description:
            "The maximum number or response records to return in each call.",
          type: "number",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new RedshiftClient({
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

        const command = new DescribeSnapshotSchedulesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Snapshot Schedules Result",
      description: "Result from DescribeSnapshotSchedules operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          SnapshotSchedules: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ScheduleDefinitions: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                ScheduleIdentifier: {
                  type: "string",
                },
                ScheduleDescription: {
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
                NextInvocations: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                AssociatedClusterCount: {
                  type: "number",
                },
                AssociatedClusters: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      ClusterIdentifier: {
                        type: "object",
                        additionalProperties: true,
                      },
                      ScheduleAssociationState: {
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
            description: "A list of SnapshotSchedules.",
          },
          Marker: {
            type: "string",
            description:
              "A value that indicates the starting point for the next set of response records in a subsequent request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeSnapshotSchedules;
