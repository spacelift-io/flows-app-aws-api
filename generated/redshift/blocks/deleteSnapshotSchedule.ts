import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  DeleteSnapshotScheduleCommand,
} from "@aws-sdk/client-redshift";

const deleteSnapshotSchedule: AppBlock = {
  name: "Delete Snapshot Schedule",
  description: `Deletes a snapshot schedule.`,
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
            "A unique identifier of the snapshot schedule to delete.",
          type: "string",
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

        const command = new DeleteSnapshotScheduleCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Snapshot Schedule Result",
      description: "Result from DeleteSnapshotSchedule operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteSnapshotSchedule;
