import { AppBlock, events } from "@slflows/sdk/v1";
import { S3Client, PutObjectTaggingCommand } from "@aws-sdk/client-s3";

const putObjectTagging: AppBlock = {
  name: "Put Object Tagging",
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
          description: "The bucket name containing the object.",
          type: "string",
          required: true,
        },
        Key: {
          name: "Key",
          description: "Name of the object key.",
          type: "string",
          required: true,
        },
        VersionId: {
          name: "Version Id",
          description:
            "The versionId of the object that the tag-set will be added to.",
          type: "string",
          required: false,
        },
        ContentMD5: {
          name: "Content MD5",
          description: "The MD5 hash for the request body.",
          type: "string",
          required: false,
        },
        ChecksumAlgorithm: {
          name: "Checksum Algorithm",
          description:
            "Indicates the algorithm used to create the checksum for the object when you use the SDK.",
          type: "string",
          required: false,
        },
        Tagging: {
          name: "Tagging",
          description: "Container for the TagSet and Tag elements",
          type: {
            type: "object",
            properties: {
              TagSet: {
                type: "array",
                items: {
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
              },
            },
            required: ["TagSet"],
            additionalProperties: false,
          },
          required: true,
        },
        ExpectedBucketOwner: {
          name: "Expected Bucket Owner",
          description: "The account ID of the expected bucket owner.",
          type: "string",
          required: false,
        },
        RequestPayer: {
          name: "Request Payer",
          description:
            "Confirms that the requester knows that they will be charged for the request.",
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

        const command = new PutObjectTaggingCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Object Tagging Result",
      description: "Result from PutObjectTagging operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          VersionId: {
            type: "string",
            description:
              "The versionId of the object the tag-set was added to.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default putObjectTagging;
