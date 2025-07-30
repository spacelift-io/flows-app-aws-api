import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, CreateKeyPairCommand } from "@aws-sdk/client-ec2";

const createKeyPair: AppBlock = {
  name: "Create Key Pair",
  description:
    "Creates an ED25519 or 2048-bit RSA key pair with the specified name and in the specified format.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        KeyName: {
          name: "Key Name",
          description: "A unique name for the key pair.",
          type: "string",
          required: true,
        },
        KeyType: {
          name: "Key Type",
          description: "The type of key pair.",
          type: "string",
          required: false,
        },
        TagSpecifications: {
          name: "Tag Specifications",
          description: "The tags to apply to the new key pair.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ResourceType: {
                  type: "string",
                },
                Tags: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Key: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Value: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
              },
              additionalProperties: false,
            },
          },
          required: false,
        },
        KeyFormat: {
          name: "Key Format",
          description: "The format of the key pair.",
          type: "string",
          required: false,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the action, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new EC2Client({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new CreateKeyPairCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Key Pair Result",
      description: "Result from CreateKeyPair operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          KeyPairId: {
            type: "string",
            description: "The ID of the key pair.",
          },
          Tags: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Key: {
                  type: "string",
                },
                Value: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "Any tags applied to the key pair.",
          },
          KeyName: {
            type: "string",
            description: "The name of the key pair.",
          },
          KeyFingerprint: {
            type: "string",
            description:
              "For RSA key pairs, the key fingerprint is the SHA-1 digest of the DER encoded private key.",
          },
          KeyMaterial: {
            type: "string",
            description:
              "An unencrypted PEM encoded RSA or ED25519 private key.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createKeyPair;
