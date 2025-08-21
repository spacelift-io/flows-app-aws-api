import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EventBridgeClient,
  CreateArchiveCommand,
} from "@aws-sdk/client-eventbridge";

const createArchive: AppBlock = {
  name: "Create Archive",
  description: "Creates an archive of events with the specified settings.",
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
          description: "The name for the archive to create.",
          type: "string",
          required: true,
        },
        EventSourceArn: {
          name: "Event Source Arn",
          description:
            "The ARN of the event bus that sends events to the archive.",
          type: "string",
          required: true,
        },
        Description: {
          name: "Description",
          description: "A description for the archive.",
          type: "string",
          required: false,
        },
        EventPattern: {
          name: "Event Pattern",
          description:
            "An event pattern to use to filter events sent to the archive.",
          type: "string",
          required: false,
        },
        RetentionDays: {
          name: "Retention Days",
          description: "The number of days to retain events for.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new CreateArchiveCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Archive Result",
      description: "Result from CreateArchive operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ArchiveArn: {
            type: "string",
            description: "The ARN of the archive that was created.",
          },
          State: {
            type: "string",
            description: "The state of the archive that was created.",
          },
          StateReason: {
            type: "string",
            description: "The reason that the archive is in the state.",
          },
          CreationTime: {
            type: "string",
            description: "The time at which the archive was created.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createArchive;
