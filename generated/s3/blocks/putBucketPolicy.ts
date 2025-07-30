import { AppBlock, events } from "@slflows/sdk/v1";
import { S3Client, PutBucketPolicyCommand } from "@aws-sdk/client-s3";

const putBucketPolicy: AppBlock = {
  name: "Put Bucket Policy",
  description: "Applies an Amazon S3 bucket policy to an Amazon S3 bucket.",
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
          description: "The name of the bucket.",
          type: "string",
          required: true,
        },
        ContentMD5: {
          name: "Content MD5",
          description: "The MD5 hash of the request body.",
          type: "string",
          required: false,
        },
        ChecksumAlgorithm: {
          name: "Checksum Algorithm",
          description:
            "Indicates the algorithm used to create the checksum for the request when you use the SDK.",
          type: "string",
          required: false,
        },
        ConfirmRemoveSelfBucketAccess: {
          name: "Confirm Remove Self Bucket Access",
          description:
            "Set this parameter to true to confirm that you want to remove your permissions to change this bucket policy in the future.",
          type: "boolean",
          required: false,
        },
        Policy: {
          name: "Policy",
          description: "The bucket policy as a JSON document.",
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

        const command = new PutBucketPolicyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Bucket Policy Result",
      description: "Result from PutBucketPolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default putBucketPolicy;
