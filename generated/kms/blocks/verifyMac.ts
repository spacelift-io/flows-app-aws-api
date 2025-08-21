import { AppBlock, events } from "@slflows/sdk/v1";
import { KMSClient, VerifyMacCommand } from "@aws-sdk/client-kms";

const verifyMac: AppBlock = {
  name: "Verify Mac",
  description:
    "Verifies the hash-based message authentication code (HMAC) for a specified message, HMAC KMS key, and MAC algorithm.",
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
          description: "The message that will be used in the verification.",
          type: "string",
          required: true,
        },
        KeyId: {
          name: "Key Id",
          description: "The KMS key that will be used in the verification.",
          type: "string",
          required: true,
        },
        MacAlgorithm: {
          name: "Mac Algorithm",
          description:
            "The MAC algorithm that will be used in the verification.",
          type: "string",
          required: true,
        },
        Mac: {
          name: "Mac",
          description: "The HMAC to verify.",
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

        const command = new VerifyMacCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Verify Mac Result",
      description: "Result from VerifyMac operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          KeyId: {
            type: "string",
            description: "The HMAC KMS key used in the verification.",
          },
          MacValid: {
            type: "boolean",
            description:
              "A Boolean value that indicates whether the HMAC was verified.",
          },
          MacAlgorithm: {
            type: "string",
            description: "The MAC algorithm used in the verification.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default verifyMac;
