import { AppBlock, events } from "@slflows/sdk/v1";
import { KMSClient, GenerateRandomCommand } from "@aws-sdk/client-kms";

const generateRandom: AppBlock = {
  name: "Generate Random",
  description: "Returns a random byte string that is cryptographically secure.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        NumberOfBytes: {
          name: "Number Of Bytes",
          description: "The length of the random byte string.",
          type: "number",
          required: false,
        },
        CustomKeyStoreId: {
          name: "Custom Key Store Id",
          description:
            "Generates the random byte string in the CloudHSM cluster that is associated with the specified CloudHSM key store.",
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

        const command = new GenerateRandomCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Generate Random Result",
      description: "Result from GenerateRandom operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Plaintext: {
            type: "string",
            description: "The random byte string.",
          },
          CiphertextForRecipient: {
            type: "string",
            description:
              "The plaintext random bytes encrypted with the public key from the Nitro enclave.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default generateRandom;
