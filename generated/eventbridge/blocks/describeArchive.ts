import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EventBridgeClient,
  DescribeArchiveCommand,
} from "@aws-sdk/client-eventbridge";

const describeArchive: AppBlock = {
  name: "Describe Archive",
  description: "Retrieves details about an archive.",
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
          description: "The name of the archive to retrieve.",
          type: "string",
          required: true,
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

        const command = new DescribeArchiveCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Archive Result",
      description: "Result from DescribeArchive operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ArchiveArn: {
            type: "string",
            description: "The ARN of the archive.",
          },
          ArchiveName: {
            type: "string",
            description: "The name of the archive.",
          },
          EventSourceArn: {
            type: "string",
            description:
              "The ARN of the event source associated with the archive.",
          },
          Description: {
            type: "string",
            description: "The description of the archive.",
          },
          EventPattern: {
            type: "string",
            description:
              "The event pattern used to filter events sent to the archive.",
          },
          State: {
            type: "string",
            description: "The state of the archive.",
          },
          StateReason: {
            type: "string",
            description: "The reason that the archive is in the state.",
          },
          KmsKeyIdentifier: {
            type: "string",
            description:
              "The identifier of the KMS customer managed key for EventBridge to use to encrypt this archive, if one has been specified.",
          },
          RetentionDays: {
            type: "number",
            description:
              "The number of days to retain events for in the archive.",
          },
          SizeBytes: {
            type: "number",
            description: "The size of the archive in bytes.",
          },
          EventCount: {
            type: "number",
            description: "The number of events in the archive.",
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

export default describeArchive;
