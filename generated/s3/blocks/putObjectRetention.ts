import { AppBlock, events } from "@slflows/sdk/v1";
import { S3Client, PutObjectRetentionCommand } from "@aws-sdk/client-s3";

const putObjectRetention: AppBlock = {
  name: "Put Object Retention",
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
            "The bucket name that contains the object you want to apply this Object Retention configuration to.",
          type: "string",
          required: true,
        },
        Key: {
          name: "Key",
          description:
            "The key name for the object that you want to apply this Object Retention configuration to.",
          type: "string",
          required: true,
        },
        Retention: {
          name: "Retention",
          description:
            "The container element for the Object Retention configuration.",
          type: {
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
          },
          required: false,
        },
        RequestPayer: {
          name: "Request Payer",
          description:
            "Confirms that the requester knows that they will be charged for the request.",
          type: "string",
          required: false,
        },
        VersionId: {
          name: "Version Id",
          description:
            "The version ID for the object that you want to apply this Object Retention configuration to.",
          type: "string",
          required: false,
        },
        BypassGovernanceRetention: {
          name: "Bypass Governance Retention",
          description:
            "Indicates whether this action should bypass Governance-mode restrictions.",
          type: "boolean",
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

        const command = new PutObjectRetentionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Object Retention Result",
      description: "Result from PutObjectRetention operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          RequestCharged: {
            type: "string",
            description:
              "If present, indicates that the requester was successfully charged for the request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default putObjectRetention;
