import { AppBlock, events } from "@slflows/sdk/v1";
import { S3Client, DeleteObjectTaggingCommand } from "@aws-sdk/client-s3";

const deleteObjectTagging: AppBlock = {
  name: "Delete Object Tagging",
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
            "The bucket name containing the objects from which to remove the tags.",
          type: "string",
          required: true,
        },
        Key: {
          name: "Key",
          description:
            "The key that identifies the object in the bucket from which to remove all tags.",
          type: "string",
          required: true,
        },
        VersionId: {
          name: "Version Id",
          description:
            "The versionId of the object that the tag-set will be removed from.",
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

        const command = new DeleteObjectTaggingCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Object Tagging Result",
      description: "Result from DeleteObjectTagging operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          VersionId: {
            type: "string",
            description:
              "The versionId of the object the tag-set was removed from.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteObjectTagging;
