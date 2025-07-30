import { AppBlock, events } from "@slflows/sdk/v1";
import { S3Client, DeleteObjectsCommand } from "@aws-sdk/client-s3";

const deleteObjects: AppBlock = {
  name: "Delete Objects",
  description:
    "This operation enables you to delete multiple objects from a bucket using a single HTTP request.",
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
          description: "The bucket name containing the objects to delete.",
          type: "string",
          required: true,
        },
        Delete: {
          name: "Delete",
          description: "Container for the request.",
          type: {
            type: "object",
            properties: {
              Objects: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Key: {
                      type: "string",
                    },
                    VersionId: {
                      type: "string",
                    },
                    ETag: {
                      type: "string",
                    },
                    LastModifiedTime: {
                      type: "string",
                    },
                    Size: {
                      type: "number",
                    },
                  },
                  required: ["Key"],
                  additionalProperties: false,
                },
              },
              Quiet: {
                type: "boolean",
              },
            },
            required: ["Objects"],
            additionalProperties: false,
          },
          required: true,
        },
        MFA: {
          name: "MFA",
          description:
            "The concatenation of the authentication device's serial number, a space, and the value that is displayed on your authentication device.",
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
        BypassGovernanceRetention: {
          name: "Bypass Governance Retention",
          description:
            "Specifies whether you want to delete this object even if it has a Governance-type Object Lock in place.",
          type: "boolean",
          required: false,
        },
        ExpectedBucketOwner: {
          name: "Expected Bucket Owner",
          description: "The account ID of the expected bucket owner.",
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

        const command = new DeleteObjectsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Objects Result",
      description: "Result from DeleteObjects operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Deleted: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Key: {
                  type: "string",
                },
                VersionId: {
                  type: "string",
                },
                DeleteMarker: {
                  type: "boolean",
                },
                DeleteMarkerVersionId: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "Container element for a successful delete.",
          },
          RequestCharged: {
            type: "string",
            description:
              "If present, indicates that the requester was successfully charged for the request.",
          },
          Errors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Key: {
                  type: "string",
                },
                VersionId: {
                  type: "string",
                },
                Code: {
                  type: "string",
                },
                Message: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "Container for a failed delete action that describes the object that Amazon S3 attempted to delete and the error it encountered.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteObjects;
