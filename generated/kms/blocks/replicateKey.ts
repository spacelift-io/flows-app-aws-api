import { AppBlock, events } from "@slflows/sdk/v1";
import { KMSClient, ReplicateKeyCommand } from "@aws-sdk/client-kms";

const replicateKey: AppBlock = {
  name: "Replicate Key",
  description: "Replicates a multi-Region key into the specified Region.",
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
            "Identifies the multi-Region primary key that is being replicated.",
          type: "string",
          required: true,
        },
        ReplicaRegion: {
          name: "Replica Region",
          description:
            "The Region ID of the Amazon Web Services Region for this replica key.",
          type: "string",
          required: true,
        },
        Policy: {
          name: "Policy",
          description: "The key policy to attach to the KMS key.",
          type: "string",
          required: false,
        },
        BypassPolicyLockoutSafetyCheck: {
          name: "Bypass Policy Lockout Safety Check",
          description:
            'Skips ("bypasses") the key policy lockout safety check.',
          type: "boolean",
          required: false,
        },
        Description: {
          name: "Description",
          description: "A description of the KMS key.",
          type: "string",
          required: false,
        },
        Tags: {
          name: "Tags",
          description: "Assigns one or more tags to the replica key.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                TagKey: {
                  type: "string",
                },
                TagValue: {
                  type: "string",
                },
              },
              required: ["TagKey", "TagValue"],
              additionalProperties: false,
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

        const command = new ReplicateKeyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Replicate Key Result",
      description: "Result from ReplicateKey operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ReplicaKeyMetadata: {
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
            description:
              "Displays details about the new replica key, including its Amazon Resource Name (key ARN) and Key states of KMS keys.",
          },
          ReplicaPolicy: {
            type: "string",
            description: "The key policy of the new replica key.",
          },
          ReplicaTags: {
            type: "array",
            items: {
              type: "object",
              properties: {
                TagKey: {
                  type: "string",
                },
                TagValue: {
                  type: "string",
                },
              },
              required: ["TagKey", "TagValue"],
              additionalProperties: false,
            },
            description: "The tags on the new replica key.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default replicateKey;
