import { AppBlock, events } from "@slflows/sdk/v1";
import { S3Client, GetBucketReplicationCommand } from "@aws-sdk/client-s3";

const getBucketReplication: AppBlock = {
  name: "Get Bucket Replication",
  description: "This operation is not supported for directory buckets.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Bucket: {
          name: "Bucket",
          description:
            "The bucket name for which to get the replication information.",
          type: "string",
          required: true,
        },
        ExpectedBucketOwner: {
          name: "Expected Bucket Owner",
          description: "The account ID of the expected bucket owner.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new S3Client({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new GetBucketReplicationCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Bucket Replication Result",
      description: "Result from GetBucketReplication operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ReplicationConfiguration: {
            type: "object",
            properties: {
              Role: {
                type: "string",
              },
              Rules: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    ID: {
                      type: "string",
                    },
                    Priority: {
                      type: "number",
                    },
                    Prefix: {
                      type: "string",
                    },
                    Filter: {
                      type: "object",
                      properties: {
                        Prefix: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Tag: {
                          type: "object",
                          additionalProperties: true,
                        },
                        And: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                    Status: {
                      type: "string",
                    },
                    SourceSelectionCriteria: {
                      type: "object",
                      properties: {
                        SseKmsEncryptedObjects: {
                          type: "object",
                          additionalProperties: true,
                        },
                        ReplicaModifications: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                    ExistingObjectReplication: {
                      type: "object",
                      properties: {
                        Status: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["Status"],
                      additionalProperties: false,
                    },
                    Destination: {
                      type: "object",
                      properties: {
                        Bucket: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Account: {
                          type: "object",
                          additionalProperties: true,
                        },
                        StorageClass: {
                          type: "object",
                          additionalProperties: true,
                        },
                        AccessControlTranslation: {
                          type: "object",
                          additionalProperties: true,
                        },
                        EncryptionConfiguration: {
                          type: "object",
                          additionalProperties: true,
                        },
                        ReplicationTime: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Metrics: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["Bucket"],
                      additionalProperties: false,
                    },
                    DeleteMarkerReplication: {
                      type: "object",
                      properties: {
                        Status: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                  required: ["Status", "Destination"],
                  additionalProperties: false,
                },
              },
            },
            required: ["Role", "Rules"],
            additionalProperties: false,
            description: "A container for replication rules.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getBucketReplication;
