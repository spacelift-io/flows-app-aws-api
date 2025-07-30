import { AppBlock, events } from "@slflows/sdk/v1";
import { S3Client, GetPublicAccessBlockCommand } from "@aws-sdk/client-s3";

const getPublicAccessBlock: AppBlock = {
  name: "Get Public Access Block",
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
            "The name of the Amazon S3 bucket whose PublicAccessBlock configuration you want to retrieve.",
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

        const command = new GetPublicAccessBlockCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Public Access Block Result",
      description: "Result from GetPublicAccessBlock operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          PublicAccessBlockConfiguration: {
            type: "object",
            properties: {
              BlockPublicAcls: {
                type: "boolean",
              },
              IgnorePublicAcls: {
                type: "boolean",
              },
              BlockPublicPolicy: {
                type: "boolean",
              },
              RestrictPublicBuckets: {
                type: "boolean",
              },
            },
            additionalProperties: false,
            description:
              "The PublicAccessBlock configuration currently in effect for this Amazon S3 bucket.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getPublicAccessBlock;
