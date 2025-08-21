import { AppBlock, events } from "@slflows/sdk/v1";
import { KMSClient, CancelKeyDeletionCommand } from "@aws-sdk/client-kms";

const cancelKeyDeletion: AppBlock = {
  name: "Cancel Key Deletion",
  description: "Cancels the deletion of a KMS key.",
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
          description:
            "Identifies the KMS key whose deletion is being canceled.",
          type: "string",
          required: true,
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new CancelKeyDeletionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Cancel Key Deletion Result",
      description: "Result from CancelKeyDeletion operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          KeyId: {
            type: "string",
            description:
              "The Amazon Resource Name (key ARN) of the KMS key whose deletion is canceled.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default cancelKeyDeletion;
