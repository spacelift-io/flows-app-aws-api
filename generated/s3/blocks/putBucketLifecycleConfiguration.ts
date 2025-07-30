import { AppBlock, events } from "@slflows/sdk/v1";
import {
  S3Client,
  PutBucketLifecycleConfigurationCommand,
} from "@aws-sdk/client-s3";

const putBucketLifecycleConfiguration: AppBlock = {
  name: "Put Bucket Lifecycle Configuration",
  description:
    "Creates a new lifecycle configuration for the bucket or replaces an existing lifecycle configuration.",
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
            "The name of the bucket for which to set the configuration.",
          type: "string",
          required: true,
        },
        ChecksumAlgorithm: {
          name: "Checksum Algorithm",
          description:
            "Indicates the algorithm used to create the checksum for the request when you use the SDK.",
          type: "string",
          required: false,
        },
        LifecycleConfiguration: {
          name: "Lifecycle Configuration",
          description: "Container for lifecycle rules.",
          type: {
            type: "object",
            properties: {
              Rules: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Expiration: {
                      type: "object",
                      properties: {
                        Date: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Days: {
                          type: "object",
                          additionalProperties: true,
                        },
                        ExpiredObjectDeleteMarker: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                    ID: {
                      type: "string",
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
                        ObjectSizeGreaterThan: {
                          type: "object",
                          additionalProperties: true,
                        },
                        ObjectSizeLessThan: {
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
                    Transitions: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    NoncurrentVersionTransitions: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    NoncurrentVersionExpiration: {
                      type: "object",
                      properties: {
                        NoncurrentDays: {
                          type: "object",
                          additionalProperties: true,
                        },
                        NewerNoncurrentVersions: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                    AbortIncompleteMultipartUpload: {
                      type: "object",
                      properties: {
                        DaysAfterInitiation: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                  required: ["Status"],
                  additionalProperties: false,
                },
              },
            },
            required: ["Rules"],
            additionalProperties: false,
          },
          required: false,
        },
        ExpectedBucketOwner: {
          name: "Expected Bucket Owner",
          description: "The account ID of the expected bucket owner.",
          type: "string",
          required: false,
        },
        TransitionDefaultMinimumObjectSize: {
          name: "Transition Default Minimum Object Size",
          description:
            "Indicates which default minimum object size behavior is applied to the lifecycle configuration.",
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

        const command = new PutBucketLifecycleConfigurationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Bucket Lifecycle Configuration Result",
      description: "Result from PutBucketLifecycleConfiguration operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TransitionDefaultMinimumObjectSize: {
            type: "string",
            description:
              "Indicates which default minimum object size behavior is applied to the lifecycle configuration.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default putBucketLifecycleConfiguration;
