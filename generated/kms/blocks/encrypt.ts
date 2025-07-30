import { AppBlock, events } from "@slflows/sdk/v1";
import { KMSClient, EncryptCommand } from "@aws-sdk/client-kms";

const encrypt: AppBlock = {
  name: "Encrypt",
  description: "Encrypts plaintext of up to 4,096 bytes using a KMS key.",
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
            "Identifies the KMS key to use in the encryption operation.",
          type: "string",
          required: true,
        },
        Plaintext: {
          name: "Plaintext",
          description: "Data to be encrypted.",
          type: "string",
          required: true,
        },
        EncryptionContext: {
          name: "Encryption Context",
          description:
            "Specifies the encryption context that will be used to encrypt the data.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
          },
          required: false,
        },
        GrantTokens: {
          name: "Grant Tokens",
          description: "A list of grant tokens.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        EncryptionAlgorithm: {
          name: "Encryption Algorithm",
          description:
            "Specifies the encryption algorithm that KMS will use to encrypt the plaintext message.",
          type: "string",
          required: false,
        },
        DryRun: {
          name: "Dry Run",
          description: "Checks if your request will succeed.",
          type: "boolean",
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

        const command = new EncryptCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Encrypt Result",
      description: "Result from Encrypt operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          CiphertextBlob: {
            type: "string",
            description: "The encrypted plaintext.",
          },
          KeyId: {
            type: "string",
            description:
              "The Amazon Resource Name (key ARN) of the KMS key that was used to encrypt the plaintext.",
          },
          EncryptionAlgorithm: {
            type: "string",
            description:
              "The encryption algorithm that was used to encrypt the plaintext.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default encrypt;
