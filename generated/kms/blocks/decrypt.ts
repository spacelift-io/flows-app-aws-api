import { AppBlock, events } from "@slflows/sdk/v1";
import { KMSClient, DecryptCommand } from "@aws-sdk/client-kms";

const decrypt: AppBlock = {
  name: "Decrypt",
  description:
    "Decrypts ciphertext that was encrypted by a KMS key using any of the following operations: Encrypt GenerateDataKey GenerateDataKeyPair GenerateDataKeyWithoutPlaintext GenerateDataKeyPairWithoutPlaintext You can use this operation to decrypt ciphertext that was encrypted under a symmetric encryption KMS key or an asymmetric encryption KMS key.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        CiphertextBlob: {
          name: "Ciphertext Blob",
          description: "Ciphertext to be decrypted.",
          type: "string",
          required: true,
        },
        EncryptionContext: {
          name: "Encryption Context",
          description:
            "Specifies the encryption context to use when decrypting the data.",
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
        KeyId: {
          name: "Key Id",
          description:
            "Specifies the KMS key that KMS uses to decrypt the ciphertext.",
          type: "string",
          required: false,
        },
        EncryptionAlgorithm: {
          name: "Encryption Algorithm",
          description:
            "Specifies the encryption algorithm that will be used to decrypt the ciphertext.",
          type: "string",
          required: false,
        },
        Recipient: {
          name: "Recipient",
          description:
            "A signed attestation document from an Amazon Web Services Nitro enclave and the encryption algorithm to use with the enclave's public key.",
          type: {
            type: "object",
            properties: {
              KeyEncryptionAlgorithm: {
                type: "string",
              },
              AttestationDocument: {
                type: "string",
              },
            },
            additionalProperties: false,
          },
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

        const command = new DecryptCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Decrypt Result",
      description: "Result from Decrypt operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          KeyId: {
            type: "string",
            description:
              "The Amazon Resource Name (key ARN) of the KMS key that was used to decrypt the ciphertext.",
          },
          Plaintext: {
            type: "string",
            description: "Decrypted plaintext data.",
          },
          EncryptionAlgorithm: {
            type: "string",
            description:
              "The encryption algorithm that was used to decrypt the ciphertext.",
          },
          CiphertextForRecipient: {
            type: "string",
            description:
              "The plaintext data encrypted with the public key in the attestation document.",
          },
          KeyMaterialId: {
            type: "string",
            description:
              "The identifier of the key material used to decrypt the ciphertext.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default decrypt;
