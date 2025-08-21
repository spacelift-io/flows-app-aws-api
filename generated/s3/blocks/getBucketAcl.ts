import { AppBlock, events } from "@slflows/sdk/v1";
import { S3Client, GetBucketAclCommand } from "@aws-sdk/client-s3";
import { serializeAWSResponse } from "../utils/serialize";

const getBucketAcl: AppBlock = {
  name: "Get Bucket Acl",
  description:
    "End of support notice: Beginning October 1, 2025, Amazon S3 will stop returning DisplayName.",
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
          description: "Specifies the S3 bucket whose ACL is being requested.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new GetBucketAclCommand(commandInput as any);
        const response = await client.send(command);

        // Safely serialize response by handling circular references and streams
        const safeResponse = await serializeAWSResponse(response);
        await events.emit(safeResponse || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Bucket Acl Result",
      description: "Result from GetBucketAcl operation",
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
        },
        additionalProperties: true,
      },
    },
  },
};

export default getBucketAcl;
