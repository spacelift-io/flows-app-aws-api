import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, CancelImportTaskCommand } from "@aws-sdk/client-ec2";

const cancelImportTask: AppBlock = {
  name: "Cancel Import Task",
  description:
    "Cancels an in-process import virtual machine or import snapshot task.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        CancelReason: {
          name: "Cancel Reason",
          description: "The reason for canceling the task.",
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
        ImportTaskId: {
          name: "Import Task Id",
          description:
            "The ID of the import image or import snapshot task to be canceled.",
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
        });

        const command = new CancelImportTaskCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Cancel Import Task Result",
      description: "Result from CancelImportTask operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ImportTaskId: {
            type: "string",
            description: "The ID of the task being canceled.",
          },
          PreviousState: {
            type: "string",
            description: "The current state of the task being canceled.",
          },
          State: {
            type: "string",
            description: "The current state of the task being canceled.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default cancelImportTask;
