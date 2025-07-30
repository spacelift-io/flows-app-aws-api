import { AppBlock, events } from "@slflows/sdk/v1";
import {
  S3Client,
  UpdateBucketMetadataInventoryTableConfigurationCommand,
} from "@aws-sdk/client-s3";

const updateBucketMetadataInventoryTableConfiguration: AppBlock = {
  name: "Update Bucket Metadata Inventory Table Configuration",
  description:
    "Enables or disables a live inventory table for an S3 Metadata configuration on a general purpose bucket.",
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
            "The general purpose bucket that corresponds to the metadata configuration that you want to enable or disable an inventory table for.",
          type: "string",
          required: true,
        },
        ContentMD5: {
          name: "Content MD5",
          description:
            "The Content-MD5 header for the inventory table configuration.",
          type: "string",
          required: false,
        },
        ChecksumAlgorithm: {
          name: "Checksum Algorithm",
          description:
            "The checksum algorithm to use with your inventory table configuration.",
          type: "string",
          required: false,
        },
        InventoryTableConfiguration: {
          name: "Inventory Table Configuration",
          description: "The contents of your inventory table configuration.",
          type: {
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
          required: true,
        },
        ExpectedBucketOwner: {
          name: "Expected Bucket Owner",
          description:
            "The expected owner of the general purpose bucket that corresponds to the metadata table configuration that you want to enable or disable an inventory table for.",
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

        const command =
          new UpdateBucketMetadataInventoryTableConfigurationCommand(
            commandInput as any,
          );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Bucket Metadata Inventory Table Configuration Result",
      description:
        "Result from UpdateBucketMetadataInventoryTableConfiguration operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default updateBucketMetadataInventoryTableConfiguration;
