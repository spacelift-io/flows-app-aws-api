import { AppBlock, events } from "@slflows/sdk/v1";
import {
  S3Client,
  CreateBucketMetadataTableConfigurationCommand,
} from "@aws-sdk/client-s3";

const createBucketMetadataTableConfiguration: AppBlock = {
  name: "Create Bucket Metadata Table Configuration",
  description:
    "We recommend that you create your S3 Metadata configurations by using the V2 CreateBucketMetadataConfiguration API operation.",
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
            "The general purpose bucket that you want to create the metadata table configuration for.",
          type: "string",
          required: true,
        },
        ContentMD5: {
          name: "Content MD5",
          description:
            "The Content-MD5 header for the metadata table configuration.",
          type: "string",
          required: false,
        },
        ChecksumAlgorithm: {
          name: "Checksum Algorithm",
          description:
            "The checksum algorithm to use with your metadata table configuration.",
          type: "string",
          required: false,
        },
        MetadataTableConfiguration: {
          name: "Metadata Table Configuration",
          description: "The contents of your metadata table configuration.",
          type: {
            type: "object",
            properties: {
              S3TablesDestination: {
                type: "object",
                properties: {
                  TableBucketArn: {
                    type: "string",
                  },
                  TableName: {
                    type: "string",
                  },
                },
                required: ["TableBucketArn", "TableName"],
                additionalProperties: false,
              },
            },
            required: ["S3TablesDestination"],
            additionalProperties: false,
          },
          required: true,
        },
        ExpectedBucketOwner: {
          name: "Expected Bucket Owner",
          description:
            "The expected owner of the general purpose bucket that corresponds to your metadata table configuration.",
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

        const command = new CreateBucketMetadataTableConfigurationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Bucket Metadata Table Configuration Result",
      description:
        "Result from CreateBucketMetadataTableConfiguration operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default createBucketMetadataTableConfiguration;
