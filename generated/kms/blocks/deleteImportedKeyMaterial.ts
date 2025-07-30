import { AppBlock, events } from "@slflows/sdk/v1";
import {
  KMSClient,
  DeleteImportedKeyMaterialCommand,
} from "@aws-sdk/client-kms";

const deleteImportedKeyMaterial: AppBlock = {
  name: "Delete Imported Key Material",
  description: "Deletes key material that was previously imported.",
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
            "Identifies the KMS key from which you are deleting imported key material.",
          type: "string",
          required: true,
        },
        KeyMaterialId: {
          name: "Key Material Id",
          description: "Identifies the imported key material you are deleting.",
          type: "string",
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

        const command = new DeleteImportedKeyMaterialCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Imported Key Material Result",
      description: "Result from DeleteImportedKeyMaterial operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          KeyId: {
            type: "string",
            description:
              "The Amazon Resource Name (key ARN) of the KMS key from which the key material was deleted.",
          },
          KeyMaterialId: {
            type: "string",
            description: "Identifies the deleted key material.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteImportedKeyMaterial;
