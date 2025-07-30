import { AppBlock, events } from "@slflows/sdk/v1";
import { KMSClient, ScheduleKeyDeletionCommand } from "@aws-sdk/client-kms";

const scheduleKeyDeletion: AppBlock = {
  name: "Schedule Key Deletion",
  description: "Schedules the deletion of a KMS key.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        KeyId: {
          name: "Key Id",
          description: "The unique identifier of the KMS key to delete.",
          type: "string",
          required: true,
        },
        PendingWindowInDays: {
          name: "Pending Window In Days",
          description: "The waiting period, specified in number of days.",
          type: "number",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new KMSClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new ScheduleKeyDeletionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Schedule Key Deletion Result",
      description: "Result from ScheduleKeyDeletion operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          KeyId: {
            type: "string",
            description:
              "The Amazon Resource Name (key ARN) of the KMS key whose deletion is scheduled.",
          },
          DeletionDate: {
            type: "string",
            description:
              "The date and time after which KMS deletes the KMS key.",
          },
          KeyState: {
            type: "string",
            description: "The current status of the KMS key.",
          },
          PendingWindowInDays: {
            type: "number",
            description: "The waiting period before the KMS key is deleted.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default scheduleKeyDeletion;
