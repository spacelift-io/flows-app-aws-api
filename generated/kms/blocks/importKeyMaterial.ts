import { AppBlock, events } from "@slflows/sdk/v1";
import { KMSClient, ImportKeyMaterialCommand } from "@aws-sdk/client-kms";

const importKeyMaterial: AppBlock = {
  name: "Import Key Material",
  description:
    "Imports or reimports key material into an existing KMS key that was created without key material.",
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
            "The identifier of the KMS key that will be associated with the imported key material.",
          type: "string",
          required: true,
        },
        ImportToken: {
          name: "Import Token",
          description:
            "The import token that you received in the response to a previous GetParametersForImport request.",
          type: "string",
          required: true,
        },
        EncryptedKeyMaterial: {
          name: "Encrypted Key Material",
          description: "The encrypted key material to import.",
          type: "string",
          required: true,
        },
        ValidTo: {
          name: "Valid To",
          description:
            "The date and time when the imported key material expires.",
          type: "string",
          required: false,
        },
        ExpirationModel: {
          name: "Expiration Model",
          description: "Specifies whether the key material expires.",
          type: "string",
          required: false,
        },
        ImportType: {
          name: "Import Type",
          description:
            "Indicates whether the key material being imported is previously associated with this KMS key or not.",
          type: "string",
          required: false,
        },
        KeyMaterialDescription: {
          name: "Key Material Description",
          description: "Description for the key material being imported.",
          type: "string",
          required: false,
        },
        KeyMaterialId: {
          name: "Key Material Id",
          description: "Identifies the key material being imported.",
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

        const command = new ImportKeyMaterialCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Import Key Material Result",
      description: "Result from ImportKeyMaterial operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          KeyId: {
            type: "string",
            description:
              "The Amazon Resource Name (key ARN) of the KMS key into which key material was imported.",
          },
          KeyMaterialId: {
            type: "string",
            description: "Identifies the imported key material.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default importKeyMaterial;
