import { AppBlock, events } from "@slflows/sdk/v1";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const listObjectsV2: AppBlock = {
  name: "List Objects V2",
  description:
    "Returns some or all (up to 1,000) of the objects in a bucket with each request.",
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
            "Directory buckets - When you use this operation with a directory bucket, you must use virtual-hosted-style requests in the format Bucket-name.",
          type: "string",
          required: true,
        },
        Delimiter: {
          name: "Delimiter",
          description: "A delimiter is a character that you use to group keys.",
          type: "string",
          required: false,
        },
        EncodingType: {
          name: "Encoding Type",
          description:
            "Encoding type used by Amazon S3 to encode the object keys in the response.",
          type: "string",
          required: false,
        },
        MaxKeys: {
          name: "Max Keys",
          description:
            "Sets the maximum number of keys returned in the response.",
          type: "number",
          required: false,
        },
        Prefix: {
          name: "Prefix",
          description:
            "Limits the response to keys that begin with the specified prefix.",
          type: "string",
          required: false,
        },
        ContinuationToken: {
          name: "Continuation Token",
          description:
            "ContinuationToken indicates to Amazon S3 that the list is being continued on this bucket with a token.",
          type: "string",
          required: false,
        },
        FetchOwner: {
          name: "Fetch Owner",
          description:
            "The owner field is not present in ListObjectsV2 by default.",
          type: "boolean",
          required: false,
        },
        StartAfter: {
          name: "Start After",
          description:
            "StartAfter is where you want Amazon S3 to start listing from.",
          type: "string",
          required: false,
        },
        RequestPayer: {
          name: "Request Payer",
          description:
            "Confirms that the requester knows that she or he will be charged for the list objects request in V2 style.",
          type: "string",
          required: false,
        },
        ExpectedBucketOwner: {
          name: "Expected Bucket Owner",
          description: "The account ID of the expected bucket owner.",
          type: "string",
          required: false,
        },
        OptionalObjectAttributes: {
          name: "Optional Object Attributes",
          description:
            "Specifies the optional fields that you want returned in the response.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
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

        const command = new ListObjectsV2Command(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Objects V2 Result",
      description: "Result from ListObjectsV2 operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          IsTruncated: {
            type: "boolean",
            description: "Set to false if all of the results were returned.",
          },
          Contents: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Key: {
                  type: "string",
                },
                LastModified: {
                  type: "string",
                },
                ETag: {
                  type: "string",
                },
                ChecksumAlgorithm: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                ChecksumType: {
                  type: "string",
                },
                Size: {
                  type: "number",
                },
                StorageClass: {
                  type: "string",
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
                },
                RestoreStatus: {
                  type: "object",
                  properties: {
                    IsRestoreInProgress: {
                      type: "boolean",
                    },
                    RestoreExpiryDate: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              additionalProperties: false,
            },
            description: "Metadata about each object returned.",
          },
          Name: {
            type: "string",
            description: "The bucket name.",
          },
          Prefix: {
            type: "string",
            description: "Keys that begin with the indicated prefix.",
          },
          Delimiter: {
            type: "string",
            description:
              "Causes keys that contain the same string between the prefix and the first occurrence of the delimiter to be rolled up into a single result element in the CommonPrefixes collection.",
          },
          MaxKeys: {
            type: "number",
            description:
              "Sets the maximum number of keys returned in the response.",
          },
          CommonPrefixes: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Prefix: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "All of the keys (up to 1,000) that share the same prefix are grouped together.",
          },
          EncodingType: {
            type: "string",
            description:
              "Encoding type used by Amazon S3 to encode object key names in the XML response.",
          },
          KeyCount: {
            type: "number",
            description:
              "KeyCount is the number of keys returned with this request.",
          },
          ContinuationToken: {
            type: "string",
            description:
              "If ContinuationToken was sent with the request, it is included in the response.",
          },
          NextContinuationToken: {
            type: "string",
            description:
              "NextContinuationToken is sent when isTruncated is true, which means there are more keys in the bucket that can be listed.",
          },
          StartAfter: {
            type: "string",
            description:
              "If StartAfter was sent with the request, it is included in the response.",
          },
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

export default listObjectsV2;
