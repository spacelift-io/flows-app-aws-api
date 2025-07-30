import { AppBlock, events } from "@slflows/sdk/v1";
import { S3Client, GetBucketVersioningCommand } from "@aws-sdk/client-s3";

const getBucketVersioning: AppBlock = {
  name: "Get Bucket Versioning",
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
            "The name of the bucket for which to get the versioning information.",
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
        });

        const command = new GetBucketVersioningCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Bucket Versioning Result",
      description: "Result from GetBucketVersioning operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Status: {
            type: "string",
            description: "The versioning state of the bucket.",
          },
          MFADelete: {
            type: "string",
            description:
              "Specifies whether MFA delete is enabled in the bucket versioning configuration.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getBucketVersioning;
