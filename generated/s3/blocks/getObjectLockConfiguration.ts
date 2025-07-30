import { AppBlock, events } from "@slflows/sdk/v1";
import {
  S3Client,
  GetObjectLockConfigurationCommand,
} from "@aws-sdk/client-s3";

const getObjectLockConfiguration: AppBlock = {
  name: "Get Object Lock Configuration",
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
            "The bucket whose Object Lock configuration you want to retrieve.",
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

        const command = new GetObjectLockConfigurationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Object Lock Configuration Result",
      description: "Result from GetObjectLockConfiguration operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ObjectLockConfiguration: {
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
            description: "The specified bucket's Object Lock configuration.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getObjectLockConfiguration;
