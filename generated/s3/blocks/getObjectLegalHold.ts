import { AppBlock, events } from "@slflows/sdk/v1";
import { S3Client, GetObjectLegalHoldCommand } from "@aws-sdk/client-s3";
import { serializeAWSResponse } from "../utils/serialize";

const getObjectLegalHold: AppBlock = {
  name: "Get Object Legal Hold",
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
            "The bucket name containing the object whose legal hold status you want to retrieve.",
          type: "string",
          required: true,
        },
        Key: {
          name: "Key",
          description:
            "The key name for the object whose legal hold status you want to retrieve.",
          type: "string",
          required: true,
        },
        VersionId: {
          name: "Version Id",
          description:
            "The version ID of the object whose legal hold status you want to retrieve.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new GetObjectLegalHoldCommand(commandInput as any);
        const response = await client.send(command);

        // Safely serialize response by handling circular references and streams
        const safeResponse = await serializeAWSResponse(response);
        await events.emit(safeResponse || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Object Legal Hold Result",
      description: "Result from GetObjectLegalHold operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          LegalHold: {
            type: "object",
            properties: {
              Status: {
                type: "string",
              },
            },
            additionalProperties: false,
            description:
              "The current legal hold status for the specified object.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getObjectLegalHold;
