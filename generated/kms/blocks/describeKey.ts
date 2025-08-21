import { AppBlock, events } from "@slflows/sdk/v1";
import { KMSClient, DescribeKeyCommand } from "@aws-sdk/client-kms";

const describeKey: AppBlock = {
  name: "Describe Key",
  description: "Provides detailed information about a KMS key.",
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
          description: "Describes the specified KMS key.",
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

        const command = new DescribeKeyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Key Result",
      description: "Result from DescribeKey operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          KeyMetadata: {
            type: "object",
            properties: {
              AWSAccountId: {
                type: "string",
              },
              KeyId: {
                type: "string",
              },
              Arn: {
                type: "string",
              },
              CreationDate: {
                type: "string",
              },
              Enabled: {
                type: "boolean",
              },
              Description: {
                type: "string",
              },
              KeyUsage: {
                type: "string",
              },
              KeyState: {
                type: "string",
              },
              DeletionDate: {
                type: "string",
              },
              ValidTo: {
                type: "string",
              },
              Origin: {
                type: "string",
              },
              CustomKeyStoreId: {
                type: "string",
              },
              CloudHsmClusterId: {
                type: "string",
              },
              ExpirationModel: {
                type: "string",
              },
              KeyManager: {
                type: "string",
              },
              CustomerMasterKeySpec: {
                type: "string",
              },
              KeySpec: {
                type: "string",
              },
              EncryptionAlgorithms: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              SigningAlgorithms: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              KeyAgreementAlgorithms: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              MultiRegion: {
                type: "boolean",
              },
              MultiRegionConfiguration: {
                type: "object",
                properties: {
                  MultiRegionKeyType: {
                    type: "string",
                  },
                  PrimaryKey: {
                    type: "object",
                    properties: {
                      Arn: {
                        type: "string",
                      },
                      Region: {
                        type: "string",
                      },
                    },
                    additionalProperties: false,
                  },
                  ReplicaKeys: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        Arn: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Region: {
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
              PendingDeletionWindowInDays: {
                type: "number",
              },
              MacAlgorithms: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              XksKeyConfiguration: {
                type: "object",
                properties: {
                  Id: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              CurrentKeyMaterialId: {
                type: "string",
              },
            },
            required: ["KeyId"],
            additionalProperties: false,
            description: "Metadata associated with the key.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeKey;
