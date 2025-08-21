import { AppBlock, events } from "@slflows/sdk/v1";
import { S3Client, PutPublicAccessBlockCommand } from "@aws-sdk/client-s3";
import { serializeAWSResponse } from "../utils/serialize";

const putPublicAccessBlock: AppBlock = {
  name: "Put Public Access Block",
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
            "The name of the Amazon S3 bucket whose PublicAccessBlock configuration you want to set.",
          type: "string",
          required: true,
        },
        ContentMD5: {
          name: "Content MD5",
          description: "The MD5 hash of the PutPublicAccessBlock request body.",
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
        PublicAccessBlockConfiguration: {
          name: "Public Access Block Configuration",
          description:
            "The PublicAccessBlock configuration that you want to apply to this Amazon S3 bucket.",
          type: {
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
          },
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

        const command = new PutPublicAccessBlockCommand(commandInput as any);
        const response = await client.send(command);

        // Safely serialize response by handling circular references and streams
        const safeResponse = await serializeAWSResponse(response);
        await events.emit(safeResponse || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Public Access Block Result",
      description: "Result from PutPublicAccessBlock operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default putPublicAccessBlock;
