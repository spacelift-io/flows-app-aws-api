import { AppBlock, events } from "@slflows/sdk/v1";
import { S3Client, ListDirectoryBucketsCommand } from "@aws-sdk/client-s3";
import { serializeAWSResponse } from "../utils/serialize";

const listDirectoryBuckets: AppBlock = {
  name: "List Directory Buckets",
  description:
    "Returns a list of all Amazon S3 directory buckets owned by the authenticated sender of the request.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ContinuationToken: {
          name: "Continuation Token",
          description:
            "ContinuationToken indicates to Amazon S3 that the list is being continued on buckets in this account with a token.",
          type: "string",
          required: false,
        },
        MaxDirectoryBuckets: {
          name: "Max Directory Buckets",
          description: "Maximum number of buckets to be returned in response.",
          type: "number",
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

        const command = new ListDirectoryBucketsCommand(commandInput as any);
        const response = await client.send(command);

        // Safely serialize response by handling circular references and streams
        const safeResponse = await serializeAWSResponse(response);
        await events.emit(safeResponse || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Directory Buckets Result",
      description: "Result from ListDirectoryBuckets operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Buckets: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: {
                  type: "string",
                },
                CreationDate: {
                  type: "string",
                },
                BucketRegion: {
                  type: "string",
                },
                BucketArn: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "The list of buckets owned by the requester.",
          },
          ContinuationToken: {
            type: "string",
            description:
              "If ContinuationToken was sent with the request, it is included in the response.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listDirectoryBuckets;
