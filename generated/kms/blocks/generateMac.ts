import { AppBlock, events } from "@slflows/sdk/v1";
import { KMSClient, GenerateMacCommand } from "@aws-sdk/client-kms";

const generateMac: AppBlock = {
  name: "Generate Mac",
  description:
    "Generates a hash-based message authentication code (HMAC) for a message using an HMAC KMS key and a MAC algorithm that the key supports.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Message: {
          name: "Message",
          description: "The message to be hashed.",
          type: "string",
          required: true,
        },
        KeyId: {
          name: "Key Id",
          description: "The HMAC KMS key to use in the operation.",
          type: "string",
          required: true,
        },
        MacAlgorithm: {
          name: "Mac Algorithm",
          description: "The MAC algorithm used in the operation.",
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
        });

        const command = new GenerateMacCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Generate Mac Result",
      description: "Result from GenerateMac operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Mac: {
            type: "string",
            description:
              "The hash-based message authentication code (HMAC) that was generated for the specified message, HMAC KMS key, and MAC algorithm.",
          },
          MacAlgorithm: {
            type: "string",
            description:
              "The MAC algorithm that was used to generate the HMAC.",
          },
          KeyId: {
            type: "string",
            description: "The HMAC KMS key used in the operation.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default generateMac;
