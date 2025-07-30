import { AppBlock, events } from "@slflows/sdk/v1";
import {
  S3Client,
  ListBucketIntelligentTieringConfigurationsCommand,
} from "@aws-sdk/client-s3";

const listBucketIntelligentTieringConfigurations: AppBlock = {
  name: "List Bucket Intelligent Tiering Configurations",
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
            "The name of the Amazon S3 bucket whose configuration you want to modify or retrieve.",
          type: "string",
          required: true,
        },
        ContinuationToken: {
          name: "Continuation Token",
          description:
            "The ContinuationToken that represents a placeholder from where this request should begin.",
          type: "string",
          required: false,
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

        const command = new ListBucketIntelligentTieringConfigurationsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Bucket Intelligent Tiering Configurations Result",
      description:
        "Result from ListBucketIntelligentTieringConfigurations operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          IsTruncated: {
            type: "boolean",
            description:
              "Indicates whether the returned list of analytics configurations is complete.",
          },
          ContinuationToken: {
            type: "string",
            description:
              "The ContinuationToken that represents a placeholder from where this request should begin.",
          },
          NextContinuationToken: {
            type: "string",
            description:
              "The marker used to continue this inventory configuration listing.",
          },
          IntelligentTieringConfigurationList: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Id: {
                  type: "string",
                },
                Filter: {
                  type: "object",
                  properties: {
                    Prefix: {
                      type: "string",
                    },
                    Tag: {
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
                      required: ["Key", "Value"],
                      additionalProperties: false,
                    },
                    And: {
                      type: "object",
                      properties: {
                        Prefix: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Tags: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                  additionalProperties: false,
                },
                Status: {
                  type: "string",
                },
                Tierings: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Days: {
                        type: "object",
                        additionalProperties: true,
                      },
                      AccessTier: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    required: ["Days", "AccessTier"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["Id", "Status", "Tierings"],
              additionalProperties: false,
            },
            description:
              "The list of S3 Intelligent-Tiering configurations for a bucket.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listBucketIntelligentTieringConfigurations;
