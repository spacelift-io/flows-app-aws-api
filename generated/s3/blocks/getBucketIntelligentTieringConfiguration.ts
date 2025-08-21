import { AppBlock, events } from "@slflows/sdk/v1";
import {
  S3Client,
  GetBucketIntelligentTieringConfigurationCommand,
} from "@aws-sdk/client-s3";
import { serializeAWSResponse } from "../utils/serialize";

const getBucketIntelligentTieringConfiguration: AppBlock = {
  name: "Get Bucket Intelligent Tiering Configuration",
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
        Id: {
          name: "Id",
          description:
            "The ID used to identify the S3 Intelligent-Tiering configuration.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new GetBucketIntelligentTieringConfigurationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        // Safely serialize response by handling circular references and streams
        const safeResponse = await serializeAWSResponse(response);
        await events.emit(safeResponse || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Bucket Intelligent Tiering Configuration Result",
      description:
        "Result from GetBucketIntelligentTieringConfiguration operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          IntelligentTieringConfiguration: {
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
                        type: "string",
                      },
                      Value: {
                        type: "string",
                      },
                    },
                    required: ["Key", "Value"],
                    additionalProperties: false,
                  },
                  And: {
                    type: "object",
                    properties: {
                      Prefix: {
                        type: "string",
                      },
                      Tags: {
                        type: "array",
                        items: {
                          type: "object",
                          additionalProperties: true,
                        },
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
                      type: "number",
                    },
                    AccessTier: {
                      type: "string",
                    },
                  },
                  required: ["Days", "AccessTier"],
                  additionalProperties: false,
                },
              },
            },
            required: ["Id", "Status", "Tierings"],
            additionalProperties: false,
            description: "Container for S3 Intelligent-Tiering configuration.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getBucketIntelligentTieringConfiguration;
