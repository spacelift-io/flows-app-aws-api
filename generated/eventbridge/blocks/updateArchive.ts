import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EventBridgeClient,
  UpdateArchiveCommand,
} from "@aws-sdk/client-eventbridge";

const updateArchive: AppBlock = {
  name: "Update Archive",
  description: "Updates the specified archive.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ArchiveName: {
          name: "Archive Name",
          description: "The name of the archive to update.",
          type: "string",
          required: true,
        },
        Description: {
          name: "Description",
          description: "The description for the archive.",
          type: "string",
          required: false,
        },
        EventPattern: {
          name: "Event Pattern",
          description:
            "The event pattern to use to filter events sent to the archive.",
          type: "string",
          required: false,
        },
        RetentionDays: {
          name: "Retention Days",
          description: "The number of days to retain events in the archive.",
          type: "number",
          required: false,
        },
        KmsKeyIdentifier: {
          name: "Kms Key Identifier",
          description:
            "The identifier of the KMS customer managed key for EventBridge to use, if you choose to use a customer managed key to encrypt this archive.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new EventBridgeClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new UpdateArchiveCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Archive Result",
      description: "Result from UpdateArchive operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ArchiveArn: {
            type: "string",
            description: "The ARN of the archive.",
          },
          State: {
            type: "string",
            description: "The state of the archive.",
          },
          StateReason: {
            type: "string",
            description: "The reason that the archive is in the current state.",
          },
          CreationTime: {
            type: "string",
            description: "The time at which the archive was updated.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateArchive;
