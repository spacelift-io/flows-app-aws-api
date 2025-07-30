import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, CancelExportTaskCommand } from "@aws-sdk/client-ec2";

const cancelExportTask: AppBlock = {
  name: "Cancel Export Task",
  description: "Cancels an active export task.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ExportTaskId: {
          name: "Export Task Id",
          description: "The ID of the export task.",
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

        const command = new CancelExportTaskCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Cancel Export Task Result",
      description: "Result from CancelExportTask operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default cancelExportTask;
