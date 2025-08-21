import { AppBlock, events } from "@slflows/sdk/v1";
import { S3Client, PutObjectLegalHoldCommand } from "@aws-sdk/client-s3";
import { serializeAWSResponse } from "../utils/serialize";

const putObjectLegalHold: AppBlock = {
  name: "Put Object Legal Hold",
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
            "The bucket name containing the object that you want to place a legal hold on.",
          type: "string",
          required: true,
        },
        Key: {
          name: "Key",
          description:
            "The key name for the object that you want to place a legal hold on.",
          type: "string",
          required: true,
        },
        LegalHold: {
          name: "Legal Hold",
          description:
            "Container element for the legal hold configuration you want to apply to the specified object.",
          type: {
            type: "object",
            properties: {
              Status: {
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
            "The version ID of the object that you want to place a legal hold on.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new PutObjectLegalHoldCommand(commandInput as any);
        const response = await client.send(command);

        // Safely serialize response by handling circular references and streams
        const safeResponse = await serializeAWSResponse(response);
        await events.emit(safeResponse || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Object Legal Hold Result",
      description: "Result from PutObjectLegalHold operation",
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

export default putObjectLegalHold;
