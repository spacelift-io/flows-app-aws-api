import { AppBlock, events } from "@slflows/sdk/v1";
import { KMSClient, SignCommand } from "@aws-sdk/client-kms";

const sign: AppBlock = {
  name: "Sign",
  description:
    "Creates a digital signature for a message or message digest by using the private key in an asymmetric signing KMS key.",
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
          description: "Identifies an asymmetric KMS key.",
          type: "string",
          required: true,
        },
        Message: {
          name: "Message",
          description: "Specifies the message or message digest to sign.",
          type: "string",
          required: true,
        },
        MessageType: {
          name: "Message Type",
          description:
            "Tells KMS whether the value of the Message parameter should be hashed as part of the signing algorithm.",
          type: "string",
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
        SigningAlgorithm: {
          name: "Signing Algorithm",
          description:
            "Specifies the signing algorithm to use when signing the message.",
          type: "string",
          required: true,
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

        const command = new SignCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Sign Result",
      description: "Result from Sign operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          KeyId: {
            type: "string",
            description:
              "The Amazon Resource Name (key ARN) of the asymmetric KMS key that was used to sign the message.",
          },
          Signature: {
            type: "string",
            description:
              "The cryptographic signature that was generated for the message.",
          },
          SigningAlgorithm: {
            type: "string",
            description:
              "The signing algorithm that was used to sign the message.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default sign;
