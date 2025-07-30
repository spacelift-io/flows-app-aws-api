import { AppBlock, events } from "@slflows/sdk/v1";
import {
  S3Client,
  GetBucketMetadataTableConfigurationCommand,
} from "@aws-sdk/client-s3";

const getBucketMetadataTableConfiguration: AppBlock = {
  name: "Get Bucket Metadata Table Configuration",
  description:
    "We recommend that you retrieve your S3 Metadata configurations by using the V2 GetBucketMetadataTableConfiguration API operation.",
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
            "The general purpose bucket that corresponds to the metadata table configuration that you want to retrieve.",
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

        const command = new GetBucketMetadataTableConfigurationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Bucket Metadata Table Configuration Result",
      description: "Result from GetBucketMetadataTableConfiguration operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          GetBucketMetadataTableConfigurationResult: {
            type: "object",
            properties: {
              MetadataTableConfigurationResult: {
                type: "object",
                properties: {
                  S3TablesDestinationResult: {
                    type: "object",
                    properties: {
                      TableBucketArn: {
                        type: "string",
                      },
                      TableName: {
                        type: "string",
                      },
                      TableArn: {
                        type: "string",
                      },
                      TableNamespace: {
                        type: "string",
                      },
                    },
                    required: [
                      "TableBucketArn",
                      "TableName",
                      "TableArn",
                      "TableNamespace",
                    ],
                    additionalProperties: false,
                  },
                },
                required: ["S3TablesDestinationResult"],
                additionalProperties: false,
              },
              Status: {
                type: "string",
              },
              Error: {
                type: "object",
                properties: {
                  ErrorCode: {
                    type: "string",
                  },
                  ErrorMessage: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
            },
            required: ["MetadataTableConfigurationResult", "Status"],
            additionalProperties: false,
            description:
              "The metadata table configuration for the general purpose bucket.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getBucketMetadataTableConfiguration;
