import { AppBlock, events } from "@slflows/sdk/v1";
import { KMSClient, UpdateKeyDescriptionCommand } from "@aws-sdk/client-kms";

const updateKeyDescription: AppBlock = {
  name: "Update Key Description",
  description: "Updates the description of a KMS key.",
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
          description: "Updates the description of the specified KMS key.",
          type: "string",
          required: true,
        },
        Description: {
          name: "Description",
          description: "New description for the KMS key.",
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
        });

        const command = new UpdateKeyDescriptionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Key Description Result",
      description: "Result from UpdateKeyDescription operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default updateKeyDescription;
