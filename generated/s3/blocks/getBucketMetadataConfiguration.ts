import { AppBlock, events } from "@slflows/sdk/v1";
import {
  S3Client,
  GetBucketMetadataConfigurationCommand,
} from "@aws-sdk/client-s3";

const getBucketMetadataConfiguration: AppBlock = {
  name: "Get Bucket Metadata Configuration",
  description:
    "Retrieves the S3 Metadata configuration for a general purpose bucket.",
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
            "The general purpose bucket that corresponds to the metadata configuration that you want to retrieve.",
          type: "string",
          required: true,
        },
        ExpectedBucketOwner: {
          name: "Expected Bucket Owner",
          description:
            "The expected owner of the general purpose bucket that you want to retrieve the metadata table configuration for.",
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

        const command = new GetBucketMetadataConfigurationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Bucket Metadata Configuration Result",
      description: "Result from GetBucketMetadataConfiguration operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          GetBucketMetadataConfigurationResult: {
            type: "object",
            properties: {
              MetadataConfigurationResult: {
                type: "object",
                properties: {
                  DestinationResult: {
                    type: "object",
                    properties: {
                      TableBucketType: {
                        type: "string",
                      },
                      TableBucketArn: {
                        type: "string",
                      },
                      TableNamespace: {
                        type: "string",
                      },
                    },
                    additionalProperties: false,
                  },
                  JournalTableConfigurationResult: {
                    type: "object",
                    properties: {
                      TableStatus: {
                        type: "string",
                      },
                      Error: {
                        type: "object",
                        properties: {
                          ErrorCode: {
                            type: "object",
                            additionalProperties: true,
                          },
                          ErrorMessage: {
                            type: "object",
                            additionalProperties: true,
                          },
                        },
                        additionalProperties: false,
                      },
                      TableName: {
                        type: "string",
                      },
                      TableArn: {
                        type: "string",
                      },
                      RecordExpiration: {
                        type: "object",
                        properties: {
                          Expiration: {
                            type: "object",
                            additionalProperties: true,
                          },
                          Days: {
                            type: "object",
                            additionalProperties: true,
                          },
                        },
                        required: ["Expiration"],
                        additionalProperties: false,
                      },
                    },
                    required: ["TableStatus", "TableName", "RecordExpiration"],
                    additionalProperties: false,
                  },
                  InventoryTableConfigurationResult: {
                    type: "object",
                    properties: {
                      ConfigurationState: {
                        type: "string",
                      },
                      TableStatus: {
                        type: "string",
                      },
                      Error: {
                        type: "object",
                        properties: {
                          ErrorCode: {
                            type: "object",
                            additionalProperties: true,
                          },
                          ErrorMessage: {
                            type: "object",
                            additionalProperties: true,
                          },
                        },
                        additionalProperties: false,
                      },
                      TableName: {
                        type: "string",
                      },
                      TableArn: {
                        type: "string",
                      },
                    },
                    required: ["ConfigurationState"],
                    additionalProperties: false,
                  },
                },
                required: ["DestinationResult"],
                additionalProperties: false,
              },
            },
            required: ["MetadataConfigurationResult"],
            additionalProperties: false,
            description:
              "The metadata configuration for the general purpose bucket.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getBucketMetadataConfiguration;
