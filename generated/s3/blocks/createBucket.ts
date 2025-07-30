import { AppBlock, events } from "@slflows/sdk/v1";
import { S3Client, CreateBucketCommand } from "@aws-sdk/client-s3";

const createBucket: AppBlock = {
  name: "Create Bucket",
  description:
    "End of support notice: Beginning October 1, 2025, Amazon S3 will discontinue support for creating new Email Grantee Access Control Lists (ACL).",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ACL: {
          name: "ACL",
          description: "The canned ACL to apply to the bucket.",
          type: "string",
          required: false,
        },
        Bucket: {
          name: "Bucket",
          description: "The name of the bucket to create.",
          type: "string",
          required: true,
        },
        CreateBucketConfiguration: {
          name: "Create Bucket Configuration",
          description: "The configuration information for the bucket.",
          type: {
            type: "object",
            properties: {
              LocationConstraint: {
                type: "string",
              },
              Location: {
                type: "object",
                properties: {
                  Type: {
                    type: "string",
                  },
                  Name: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              Bucket: {
                type: "object",
                properties: {
                  DataRedundancy: {
                    type: "string",
                  },
                  Type: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              Tags: {
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
            additionalProperties: false,
          },
          required: false,
        },
        GrantFullControl: {
          name: "Grant Full Control",
          description:
            "Allows grantee the read, write, read ACP, and write ACP permissions on the bucket.",
          type: "string",
          required: false,
        },
        GrantRead: {
          name: "Grant Read",
          description: "Allows grantee to list the objects in the bucket.",
          type: "string",
          required: false,
        },
        GrantReadACP: {
          name: "Grant Read ACP",
          description: "Allows grantee to read the bucket ACL.",
          type: "string",
          required: false,
        },
        GrantWrite: {
          name: "Grant Write",
          description: "Allows grantee to create new objects in the bucket.",
          type: "string",
          required: false,
        },
        GrantWriteACP: {
          name: "Grant Write ACP",
          description:
            "Allows grantee to write the ACL for the applicable bucket.",
          type: "string",
          required: false,
        },
        ObjectLockEnabledForBucket: {
          name: "Object Lock Enabled For Bucket",
          description:
            "Specifies whether you want S3 Object Lock to be enabled for the new bucket.",
          type: "boolean",
          required: false,
        },
        ObjectOwnership: {
          name: "Object Ownership",
          description:
            "The container element for object ownership for a bucket's ownership controls.",
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

        const command = new CreateBucketCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Bucket Result",
      description: "Result from CreateBucket operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Location: {
            type: "string",
            description: "A forward slash followed by the name of the bucket.",
          },
          BucketArn: {
            type: "string",
            description: "The Amazon Resource Name (ARN) of the S3 bucket.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createBucket;
