import { AppBlock, events } from "@slflows/sdk/v1";
import { S3Client, ListObjectVersionsCommand } from "@aws-sdk/client-s3";

const listObjectVersions: AppBlock = {
  name: "List Object Versions",
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
        Bucket: {
          name: "Bucket",
          description: "The bucket name that contains the objects.",
          type: "string",
          required: true,
        },
        Delimiter: {
          name: "Delimiter",
          description:
            "A delimiter is a character that you specify to group keys.",
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
        KeyMarker: {
          name: "Key Marker",
          description:
            "Specifies the key to start with when listing objects in a bucket.",
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
            "Use this parameter to select only those keys that begin with the specified prefix.",
          type: "string",
          required: false,
        },
        VersionIdMarker: {
          name: "Version Id Marker",
          description:
            "Specifies the object version you want to start listing from.",
          type: "string",
          required: false,
        },
        ExpectedBucketOwner: {
          name: "Expected Bucket Owner",
          description: "The account ID of the expected bucket owner.",
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

        const command = new ListObjectVersionsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Object Versions Result",
      description: "Result from ListObjectVersions operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          IsTruncated: {
            type: "boolean",
            description:
              "A flag that indicates whether Amazon S3 returned all of the results that satisfied the search criteria.",
          },
          KeyMarker: {
            type: "string",
            description: "Marks the last key returned in a truncated response.",
          },
          VersionIdMarker: {
            type: "string",
            description:
              "Marks the last version of the key returned in a truncated response.",
          },
          NextKeyMarker: {
            type: "string",
            description:
              "When the number of responses exceeds the value of MaxKeys, NextKeyMarker specifies the first key not returned that satisfies the search criteria.",
          },
          NextVersionIdMarker: {
            type: "string",
            description:
              "When the number of responses exceeds the value of MaxKeys, NextVersionIdMarker specifies the first object version not returned that satisfies the search criteria.",
          },
          Versions: {
            type: "array",
            items: {
              type: "object",
              properties: {
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
                Key: {
                  type: "string",
                },
                VersionId: {
                  type: "string",
                },
                IsLatest: {
                  type: "boolean",
                },
                LastModified: {
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
            description: "Container for version information.",
          },
          DeleteMarkers: {
            type: "array",
            items: {
              type: "object",
              properties: {
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
                Key: {
                  type: "string",
                },
                VersionId: {
                  type: "string",
                },
                IsLatest: {
                  type: "boolean",
                },
                LastModified: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "Container for an object that is a delete marker.",
          },
          Name: {
            type: "string",
            description: "The bucket name.",
          },
          Prefix: {
            type: "string",
            description:
              "Selects objects that start with the value supplied by this parameter.",
          },
          Delimiter: {
            type: "string",
            description: "The delimiter grouping the included keys.",
          },
          MaxKeys: {
            type: "number",
            description: "Specifies the maximum number of objects to return.",
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
              "All of the keys rolled up into a common prefix count as a single return when calculating the number of returns.",
          },
          EncodingType: {
            type: "string",
            description:
              "Encoding type used by Amazon S3 to encode object key names in the XML response.",
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

export default listObjectVersions;
