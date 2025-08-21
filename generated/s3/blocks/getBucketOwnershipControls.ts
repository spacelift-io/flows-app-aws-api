import { AppBlock, events } from "@slflows/sdk/v1";
import {
  S3Client,
  GetBucketOwnershipControlsCommand,
} from "@aws-sdk/client-s3";
import { serializeAWSResponse } from "../utils/serialize";

const getBucketOwnershipControls: AppBlock = {
  name: "Get Bucket Ownership Controls",
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
            "The name of the Amazon S3 bucket whose OwnershipControls you want to retrieve.",
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

        const command = new GetBucketOwnershipControlsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        // Safely serialize response by handling circular references and streams
        const safeResponse = await serializeAWSResponse(response);
        await events.emit(safeResponse || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Bucket Ownership Controls Result",
      description: "Result from GetBucketOwnershipControls operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          OwnershipControls: {
            type: "object",
            properties: {
              Rules: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    ObjectOwnership: {
                      type: "string",
                    },
                  },
                  required: ["ObjectOwnership"],
                  additionalProperties: false,
                },
              },
            },
            required: ["Rules"],
            additionalProperties: false,
            description:
              "The OwnershipControls (BucketOwnerEnforced, BucketOwnerPreferred, or ObjectWriter) currently in effect for this Amazon S3 bucket.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getBucketOwnershipControls;
