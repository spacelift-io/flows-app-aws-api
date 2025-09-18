import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  ModifySnapshotScheduleCommand,
} from "@aws-sdk/client-redshift";

const modifySnapshotSchedule: AppBlock = {
  name: "Modify Snapshot Schedule",
  description: `Modifies a snapshot schedule.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ScheduleIdentifier: {
          name: "Schedule Identifier",
          description:
            "A unique alphanumeric identifier of the schedule to modify.",
          type: "string",
          required: true,
        },
        ScheduleDefinitions: {
          name: "Schedule Definitions",
          description: "An updated list of schedule definitions.",
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

        const command = new ModifySnapshotScheduleCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Snapshot Schedule Result",
      description: "Result from ModifySnapshotSchedule operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ScheduleDefinitions: {
            type: "array",
            items: {
              type: "string",
            },
            description: "A list of ScheduleDefinitions.",
          },
          ScheduleIdentifier: {
            type: "string",
            description: "A unique identifier for the schedule.",
          },
          ScheduleDescription: {
            type: "string",
            description: "The description of the schedule.",
          },
          Tags: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Key: {
                  type: "string",
                },
                Value: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "An optional set of tags describing the schedule.",
          },
          NextInvocations: {
            type: "array",
            items: {
              type: "string",
            },
            description: "",
          },
          AssociatedClusterCount: {
            type: "number",
            description: "The number of clusters associated with the schedule.",
          },
          AssociatedClusters: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ClusterIdentifier: {
                  type: "string",
                },
                ScheduleAssociationState: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "A list of clusters associated with the schedule.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default modifySnapshotSchedule;
