import { AppBlock, events } from "@slflows/sdk/v1";
import {
  S3Client,
  DeleteBucketMetadataTableConfigurationCommand,
} from "@aws-sdk/client-s3";
import { serializeAWSResponse } from "../utils/serialize";

const deleteBucketMetadataTableConfiguration: AppBlock = {
  name: "Delete Bucket Metadata Table Configuration",
  description:
    "We recommend that you delete your S3 Metadata configurations by using the V2 DeleteBucketMetadataTableConfiguration API operation.",
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
            "The general purpose bucket that you want to remove the metadata table configuration from.",
          type: "string",
          required: true,
        },
        ExpectedBucketOwner: {
          name: "Expected Bucket Owner",
          description:
            "The expected bucket owner of the general purpose bucket that you want to remove the metadata table configuration from.",
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

        const command = new DeleteBucketMetadataTableConfigurationCommand(
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
      name: "Delete Bucket Metadata Table Configuration Result",
      description:
        "Result from DeleteBucketMetadataTableConfiguration operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteBucketMetadataTableConfiguration;
