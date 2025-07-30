import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, ImportKeyPairCommand } from "@aws-sdk/client-ec2";

const importKeyPair: AppBlock = {
  name: "Import Key Pair",
  description:
    "Imports the public key from an RSA or ED25519 key pair that you created using a third-party tool.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TagSpecifications: {
          name: "Tag Specifications",
          description: "The tags to apply to the imported key pair.",
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
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the action, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
        },
        KeyName: {
          name: "Key Name",
          description: "A unique name for the key pair.",
          type: "string",
          required: true,
        },
        PublicKeyMaterial: {
          name: "Public Key Material",
          description: "The public key.",
          type: "string",
          required: true,
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

        const command = new ImportKeyPairCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Import Key Pair Result",
      description: "Result from ImportKeyPair operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          KeyFingerprint: {
            type: "string",
            description:
              "For RSA key pairs, the key fingerprint is the MD5 public key fingerprint as specified in section 4 of RFC 4716.",
          },
          KeyName: {
            type: "string",
            description: "The key pair name that you provided.",
          },
          KeyPairId: {
            type: "string",
            description: "The ID of the resulting key pair.",
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
            description: "The tags applied to the imported key pair.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default importKeyPair;
