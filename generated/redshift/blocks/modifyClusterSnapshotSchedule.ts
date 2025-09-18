import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  ModifyClusterSnapshotScheduleCommand,
} from "@aws-sdk/client-redshift";

const modifyClusterSnapshotSchedule: AppBlock = {
  name: "Modify Cluster Snapshot Schedule",
  description: `Modifies a snapshot schedule for a cluster.`,
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
            "A unique identifier for the cluster whose snapshot schedule you want to modify.",
          type: "string",
          required: true,
        },
        ScheduleIdentifier: {
          name: "Schedule Identifier",
          description:
            "A unique alphanumeric identifier for the schedule that you want to associate with the cluster.",
          type: "string",
          required: false,
        },
        DisassociateSchedule: {
          name: "Disassociate Schedule",
          description:
            "A boolean to indicate whether to remove the assoiciation between the cluster and the schedule.",
          type: "boolean",
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

        const command = new ModifyClusterSnapshotScheduleCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Cluster Snapshot Schedule Result",
      description: "Result from ModifyClusterSnapshotSchedule operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default modifyClusterSnapshotSchedule;
