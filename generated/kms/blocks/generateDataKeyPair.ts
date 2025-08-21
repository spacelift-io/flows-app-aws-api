import { AppBlock, events } from "@slflows/sdk/v1";
import { KMSClient, GenerateDataKeyPairCommand } from "@aws-sdk/client-kms";

const generateDataKeyPair: AppBlock = {
  name: "Generate Data Key Pair",
  description:
    "Returns a unique asymmetric data key pair for use outside of KMS.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        EncryptionContext: {
          name: "Encryption Context",
          description:
            "Specifies the encryption context that will be used when encrypting the private key in the data key pair.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
          },
          required: false,
        },
        KeyId: {
          name: "Key Id",
          description:
            "Specifies the symmetric encryption KMS key that encrypts the private key in the data key pair.",
          type: "string",
          required: true,
        },
        KeyPairSpec: {
          name: "Key Pair Spec",
          description:
            "Determines the type of data key pair that is generated.",
          type: "string",
          required: true,
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new GenerateDataKeyPairCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Generate Data Key Pair Result",
      description: "Result from GenerateDataKeyPair operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          PrivateKeyCiphertextBlob: {
            type: "string",
            description: "The encrypted copy of the private key.",
          },
          PrivateKeyPlaintext: {
            type: "string",
            description: "The plaintext copy of the private key.",
          },
          PublicKey: {
            type: "string",
            description: "The public key (in plaintext).",
          },
          KeyId: {
            type: "string",
            description:
              "The Amazon Resource Name (key ARN) of the KMS key that encrypted the private key.",
          },
          KeyPairSpec: {
            type: "string",
            description: "The type of data key pair that was generated.",
          },
          CiphertextForRecipient: {
            type: "string",
            description:
              "The plaintext private data key encrypted with the public key from the Nitro enclave.",
          },
          KeyMaterialId: {
            type: "string",
            description:
              "The identifier of the key material used to encrypt the private key.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default generateDataKeyPair;
