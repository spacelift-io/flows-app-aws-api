import { AppBlock, events } from "@slflows/sdk/v1";
import { S3Client, PutBucketAclCommand } from "@aws-sdk/client-s3";
import { serializeAWSResponse } from "../utils/serialize";

const putBucketAcl: AppBlock = {
  name: "Put Bucket Acl",
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
        AccessControlPolicy: {
          name: "Access Control Policy",
          description:
            "Contains the elements that set the ACL permissions for an object per grantee.",
          type: {
            type: "object",
            properties: {
              Grants: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Grantee: {
                      type: "object",
                      properties: {
                        DisplayName: {
                          type: "object",
                          additionalProperties: true,
                        },
                        EmailAddress: {
                          type: "object",
                          additionalProperties: true,
                        },
                        ID: {
                          type: "object",
                          additionalProperties: true,
                        },
                        URI: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Type: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["Type"],
                      additionalProperties: false,
                    },
                    Permission: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              Owner: {
                type: "object",
                properties: {
                  DisplayName: {
                    type: "string",
                  },
                  ID: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        Bucket: {
          name: "Bucket",
          description: "The bucket to which to apply the ACL.",
          type: "string",
          required: true,
        },
        ContentMD5: {
          name: "Content MD5",
          description: "The Base64 encoded 128-bit MD5 digest of the data.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new PutBucketAclCommand(commandInput as any);
        const response = await client.send(command);

        // Safely serialize response by handling circular references and streams
        const safeResponse = await serializeAWSResponse(response);
        await events.emit(safeResponse || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Bucket Acl Result",
      description: "Result from PutBucketAcl operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default putBucketAcl;
