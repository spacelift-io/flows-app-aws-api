import { AppBlock, events } from "@slflows/sdk/v1";
import {
  S3Client,
  CreateBucketMetadataConfigurationCommand,
} from "@aws-sdk/client-s3";

const createBucketMetadataConfiguration: AppBlock = {
  name: "Create Bucket Metadata Configuration",
  description:
    "Creates an S3 Metadata V2 metadata configuration for a general purpose bucket.",
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
            "The general purpose bucket that you want to create the metadata configuration for.",
          type: "string",
          required: true,
        },
        ContentMD5: {
          name: "Content MD5",
          description: "The Content-MD5 header for the metadata configuration.",
          type: "string",
          required: false,
        },
        ChecksumAlgorithm: {
          name: "Checksum Algorithm",
          description:
            "The checksum algorithm to use with your metadata configuration.",
          type: "string",
          required: false,
        },
        MetadataConfiguration: {
          name: "Metadata Configuration",
          description: "The contents of your metadata configuration.",
          type: {
            type: "object",
            properties: {
              JournalTableConfiguration: {
                type: "object",
                properties: {
                  RecordExpiration: {
                    type: "object",
                    properties: {
                      Expiration: {
                        type: "string",
                      },
                      Days: {
                        type: "number",
                      },
                    },
                    required: ["Expiration"],
                    additionalProperties: false,
                  },
                  EncryptionConfiguration: {
                    type: "object",
                    properties: {
                      SseAlgorithm: {
                        type: "string",
                      },
                      KmsKeyArn: {
                        type: "string",
                      },
                    },
                    required: ["SseAlgorithm"],
                    additionalProperties: false,
                  },
                },
                required: ["RecordExpiration"],
                additionalProperties: false,
              },
              InventoryTableConfiguration: {
                type: "object",
                properties: {
                  ConfigurationState: {
                    type: "string",
                  },
                  EncryptionConfiguration: {
                    type: "object",
                    properties: {
                      SseAlgorithm: {
                        type: "string",
                      },
                      KmsKeyArn: {
                        type: "string",
                      },
                    },
                    required: ["SseAlgorithm"],
                    additionalProperties: false,
                  },
                },
                required: ["ConfigurationState"],
                additionalProperties: false,
              },
            },
            required: ["JournalTableConfiguration"],
            additionalProperties: false,
          },
          required: true,
        },
        ExpectedBucketOwner: {
          name: "Expected Bucket Owner",
          description:
            "The expected owner of the general purpose bucket that corresponds to your metadata configuration.",
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

        const command = new CreateBucketMetadataConfigurationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Bucket Metadata Configuration Result",
      description: "Result from CreateBucketMetadataConfiguration operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default createBucketMetadataConfiguration;
