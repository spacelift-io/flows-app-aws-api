import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, DescribeKeyPairsCommand } from "@aws-sdk/client-ec2";

const describeKeyPairs: AppBlock = {
  name: "Describe Key Pairs",
  description: "Describes the specified key pairs or all of your key pairs.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        KeyNames: {
          name: "Key Names",
          description: "The key pair names.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        KeyPairIds: {
          name: "Key Pair Ids",
          description: "The IDs of the key pairs.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        IncludePublicKey: {
          name: "Include Public Key",
          description:
            "If true, the public key material is included in the response.",
          type: "boolean",
          required: false,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the action, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
        },
        Filters: {
          name: "Filters",
          description: "The filters.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: {
                  type: "string",
                },
                Values: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              additionalProperties: false,
            },
          },
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new DescribeKeyPairsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Key Pairs Result",
      description: "Result from DescribeKeyPairs operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          KeyPairs: {
            type: "array",
            items: {
              type: "object",
              properties: {
                KeyPairId: {
                  type: "string",
                },
                KeyType: {
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
                PublicKey: {
                  type: "string",
                },
                CreateTime: {
                  type: "string",
                },
                KeyName: {
                  type: "string",
                },
                KeyFingerprint: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "Information about the key pairs.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeKeyPairs;
