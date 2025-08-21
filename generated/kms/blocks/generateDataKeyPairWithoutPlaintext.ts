import { AppBlock, events } from "@slflows/sdk/v1";
import {
  KMSClient,
  GenerateDataKeyPairWithoutPlaintextCommand,
} from "@aws-sdk/client-kms";

const generateDataKeyPairWithoutPlaintext: AppBlock = {
  name: "Generate Data Key Pair Without Plaintext",
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

        const command = new GenerateDataKeyPairWithoutPlaintextCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Generate Data Key Pair Without Plaintext Result",
      description: "Result from GenerateDataKeyPairWithoutPlaintext operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          PrivateKeyCiphertextBlob: {
            type: "string",
            description: "The encrypted copy of the private key.",
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

export default generateDataKeyPairWithoutPlaintext;
