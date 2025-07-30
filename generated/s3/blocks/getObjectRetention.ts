import { AppBlock, events } from "@slflows/sdk/v1";
import { S3Client, GetObjectRetentionCommand } from "@aws-sdk/client-s3";

const getObjectRetention: AppBlock = {
  name: "Get Object Retention",
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
            "The bucket name containing the object whose retention settings you want to retrieve.",
          type: "string",
          required: true,
        },
        Key: {
          name: "Key",
          description:
            "The key name for the object whose retention settings you want to retrieve.",
          type: "string",
          required: true,
        },
        VersionId: {
          name: "Version Id",
          description:
            "The version ID for the object whose retention settings you want to retrieve.",
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

        const command = new GetObjectRetentionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Object Retention Result",
      description: "Result from GetObjectRetention operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Retention: {
            type: "object",
            properties: {
              Mode: {
                type: "string",
              },
              RetainUntilDate: {
                type: "string",
              },
            },
            additionalProperties: false,
            description:
              "The container element for an object's retention settings.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getObjectRetention;
