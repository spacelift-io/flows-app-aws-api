import { AppBlock, events } from "@slflows/sdk/v1";
import { S3Client, HeadBucketCommand } from "@aws-sdk/client-s3";

const headBucket: AppBlock = {
  name: "Head Bucket",
  description:
    "You can use this operation to determine if a bucket exists and if you have permission to access it.",
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
          description: "The bucket name.",
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

        const command = new HeadBucketCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Head Bucket Result",
      description: "Result from HeadBucket operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          BucketArn: {
            type: "string",
            description: "The Amazon Resource Name (ARN) of the S3 bucket.",
          },
          BucketLocationType: {
            type: "string",
            description: "The type of location where the bucket is created.",
          },
          BucketLocationName: {
            type: "string",
            description:
              "The name of the location where the bucket will be created.",
          },
          BucketRegion: {
            type: "string",
            description: "The Region that the bucket is located.",
          },
          AccessPointAlias: {
            type: "boolean",
            description:
              "Indicates whether the bucket name used in the request is an access point alias.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default headBucket;
