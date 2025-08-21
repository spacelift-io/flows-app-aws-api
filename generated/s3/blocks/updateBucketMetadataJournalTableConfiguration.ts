import { AppBlock, events } from "@slflows/sdk/v1";
import {
  S3Client,
  UpdateBucketMetadataJournalTableConfigurationCommand,
} from "@aws-sdk/client-s3";
import { serializeAWSResponse } from "../utils/serialize";

const updateBucketMetadataJournalTableConfiguration: AppBlock = {
  name: "Update Bucket Metadata Journal Table Configuration",
  description:
    "Enables or disables journal table record expiration for an S3 Metadata configuration on a general purpose bucket.",
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
            "The general purpose bucket that corresponds to the metadata configuration that you want to enable or disable journal table record expiration for.",
          type: "string",
          required: true,
        },
        ContentMD5: {
          name: "Content MD5",
          description:
            "The Content-MD5 header for the journal table configuration.",
          type: "string",
          required: false,
        },
        ChecksumAlgorithm: {
          name: "Checksum Algorithm",
          description:
            "The checksum algorithm to use with your journal table configuration.",
          type: "string",
          required: false,
        },
        JournalTableConfiguration: {
          name: "Journal Table Configuration",
          description: "The contents of your journal table configuration.",
          type: {
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
            },
            required: ["RecordExpiration"],
            additionalProperties: false,
          },
          required: true,
        },
        ExpectedBucketOwner: {
          name: "Expected Bucket Owner",
          description:
            "The expected owner of the general purpose bucket that corresponds to the metadata table configuration that you want to enable or disable journal table record expiration for.",
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

        const command =
          new UpdateBucketMetadataJournalTableConfigurationCommand(
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
      name: "Update Bucket Metadata Journal Table Configuration Result",
      description:
        "Result from UpdateBucketMetadataJournalTableConfiguration operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default updateBucketMetadataJournalTableConfiguration;
