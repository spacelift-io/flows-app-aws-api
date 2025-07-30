import { AppBlock, events } from "@slflows/sdk/v1";
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";

const listBuckets: AppBlock = {
  name: "List Buckets",
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
        MaxBuckets: {
          name: "Max Buckets",
          description: "Maximum number of buckets to be returned in response.",
          type: "number",
          required: false,
        },
        ContinuationToken: {
          name: "Continuation Token",
          description:
            "ContinuationToken indicates to Amazon S3 that the list is being continued on this bucket with a token.",
          type: "string",
          required: false,
        },
        Prefix: {
          name: "Prefix",
          description:
            "Limits the response to bucket names that begin with the specified bucket name prefix.",
          type: "string",
          required: false,
        },
        BucketRegion: {
          name: "Bucket Region",
          description:
            "Limits the response to buckets that are located in the specified Amazon Web Services Region.",
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

        const command = new ListBucketsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Buckets Result",
      description: "Result from ListBuckets operation",
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
            description: "The owner of the buckets listed.",
          },
          ContinuationToken: {
            type: "string",
            description:
              "ContinuationToken is included in the response when there are more buckets that can be listed with pagination.",
          },
          Prefix: {
            type: "string",
            description:
              "If Prefix was sent with the request, it is included in the response.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listBuckets;
