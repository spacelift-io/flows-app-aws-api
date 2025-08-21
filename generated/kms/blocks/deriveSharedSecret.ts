import { AppBlock, events } from "@slflows/sdk/v1";
import { KMSClient, DeriveSharedSecretCommand } from "@aws-sdk/client-kms";

const deriveSharedSecret: AppBlock = {
  name: "Derive Shared Secret",
  description: "Derives a shared secret using a key agreement algorithm.",
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
            "Identifies an asymmetric NIST-recommended ECC or SM2 (China Regions only) KMS key.",
          type: "string",
          required: true,
        },
        KeyAgreementAlgorithm: {
          name: "Key Agreement Algorithm",
          description:
            "Specifies the key agreement algorithm used to derive the shared secret.",
          type: "string",
          required: true,
        },
        PublicKey: {
          name: "Public Key",
          description:
            "Specifies the public key in your peer's NIST-recommended elliptic curve (ECC) or SM2 (China Regions only) key pair.",
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
        DryRun: {
          name: "Dry Run",
          description: "Checks if your request will succeed.",
          type: "boolean",
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

        const command = new DeriveSharedSecretCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Derive Shared Secret Result",
      description: "Result from DeriveSharedSecret operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          KeyId: {
            type: "string",
            description:
              "Identifies the KMS key used to derive the shared secret.",
          },
          SharedSecret: {
            type: "string",
            description:
              "The raw secret derived from the specified key agreement algorithm, private key in the asymmetric KMS key, and your peer's public key.",
          },
          CiphertextForRecipient: {
            type: "string",
            description:
              "The plaintext shared secret encrypted with the public key in the attestation document.",
          },
          KeyAgreementAlgorithm: {
            type: "string",
            description:
              "Identifies the key agreement algorithm used to derive the shared secret.",
          },
          KeyOrigin: {
            type: "string",
            description:
              "The source of the key material for the specified KMS key.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deriveSharedSecret;
