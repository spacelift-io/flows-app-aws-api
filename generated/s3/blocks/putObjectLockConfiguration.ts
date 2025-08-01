import { AppBlock, events } from "@slflows/sdk/v1";
import {
  S3Client,
  PutObjectLockConfigurationCommand,
} from "@aws-sdk/client-s3";

const putObjectLockConfiguration: AppBlock = {
  name: "Put Object Lock Configuration",
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
            "The bucket whose Object Lock configuration you want to create or replace.",
          type: "string",
          required: true,
        },
        ObjectLockConfiguration: {
          name: "Object Lock Configuration",
          description:
            "The Object Lock configuration that you want to apply to the specified bucket.",
          type: {
            type: "object",
            properties: {
              ObjectLockEnabled: {
                type: "string",
              },
              Rule: {
                type: "object",
                properties: {
                  DefaultRetention: {
                    type: "object",
                    properties: {
                      Mode: {
                        type: "string",
                      },
                      Days: {
                        type: "number",
                      },
                      Years: {
                        type: "number",
                      },
                    },
                    additionalProperties: false,
                  },
                },
                additionalProperties: false,
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
        Token: {
          name: "Token",
          description:
            "A token to allow Object Lock to be enabled for an existing bucket.",
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

        const command = new PutObjectLockConfigurationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Object Lock Configuration Result",
      description: "Result from PutObjectLockConfiguration operation",
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

export default putObjectLockConfiguration;
