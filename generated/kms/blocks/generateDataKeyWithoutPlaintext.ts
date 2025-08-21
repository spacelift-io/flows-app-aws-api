import { AppBlock, events } from "@slflows/sdk/v1";
import {
  KMSClient,
  GenerateDataKeyWithoutPlaintextCommand,
} from "@aws-sdk/client-kms";

const generateDataKeyWithoutPlaintext: AppBlock = {
  name: "Generate Data Key Without Plaintext",
  description: "Returns a unique symmetric data key for use outside of KMS.",
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
            "Specifies the symmetric encryption KMS key that encrypts the data key.",
          type: "string",
          required: true,
        },
        EncryptionContext: {
          name: "Encryption Context",
          description:
            "Specifies the encryption context that will be used when encrypting the data key.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
          },
          required: false,
        },
        KeySpec: {
          name: "Key Spec",
          description: "The length of the data key.",
          type: "string",
          required: false,
        },
        NumberOfBytes: {
          name: "Number Of Bytes",
          description: "The length of the data key in bytes.",
          type: "number",
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

        const command = new GenerateDataKeyWithoutPlaintextCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Generate Data Key Without Plaintext Result",
      description: "Result from GenerateDataKeyWithoutPlaintext operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          CiphertextBlob: {
            type: "string",
            description: "The encrypted data key.",
          },
          KeyId: {
            type: "string",
            description:
              "The Amazon Resource Name (key ARN) of the KMS key that encrypted the data key.",
          },
          KeyMaterialId: {
            type: "string",
            description:
              "The identifier of the key material used to encrypt the data key.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default generateDataKeyWithoutPlaintext;
