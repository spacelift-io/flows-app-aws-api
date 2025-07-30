import { AppBlock, events } from "@slflows/sdk/v1";
import { S3Client, GetObjectAclCommand } from "@aws-sdk/client-s3";

const getObjectAcl: AppBlock = {
  name: "Get Object Acl",
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
            "The bucket name that contains the object for which to get the ACL information.",
          type: "string",
          required: true,
        },
        Key: {
          name: "Key",
          description:
            "The key of the object for which to get the ACL information.",
          type: "string",
          required: true,
        },
        VersionId: {
          name: "Version Id",
          description:
            "Version ID used to reference a specific version of the object.",
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

        const command = new GetObjectAclCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Object Acl Result",
      description: "Result from GetObjectAcl operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
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
            description:
              "Container for the bucket owner's display name and ID.",
          },
          Grants: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Grantee: {
                  type: "object",
                  properties: {
                    DisplayName: {
                      type: "string",
                    },
                    EmailAddress: {
                      type: "string",
                    },
                    ID: {
                      type: "string",
                    },
                    URI: {
                      type: "string",
                    },
                    Type: {
                      type: "string",
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
            description: "A list of grants.",
          },
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

export default getObjectAcl;
