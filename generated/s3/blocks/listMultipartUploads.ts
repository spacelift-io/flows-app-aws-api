import { AppBlock, events } from "@slflows/sdk/v1";
import { S3Client, ListMultipartUploadsCommand } from "@aws-sdk/client-s3";

const listMultipartUploads: AppBlock = {
  name: "List Multipart Uploads",
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
          description:
            "The name of the bucket to which the multipart upload was initiated.",
          type: "string",
          required: true,
        },
        Delimiter: {
          name: "Delimiter",
          description: "Character you use to group keys.",
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
            "Specifies the multipart upload after which listing should begin.",
          type: "string",
          required: false,
        },
        MaxUploads: {
          name: "Max Uploads",
          description:
            "Sets the maximum number of multipart uploads, from 1 to 1,000, to return in the response body.",
          type: "number",
          required: false,
        },
        Prefix: {
          name: "Prefix",
          description:
            "Lists in-progress uploads only for those keys that begin with the specified prefix.",
          type: "string",
          required: false,
        },
        UploadIdMarker: {
          name: "Upload Id Marker",
          description:
            "Together with key-marker, specifies the multipart upload after which listing should begin.",
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

        const command = new ListMultipartUploadsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Multipart Uploads Result",
      description: "Result from ListMultipartUploads operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Bucket: {
            type: "string",
            description:
              "The name of the bucket to which the multipart upload was initiated.",
          },
          KeyMarker: {
            type: "string",
            description: "The key at or after which the listing began.",
          },
          UploadIdMarker: {
            type: "string",
            description:
              "Together with key-marker, specifies the multipart upload after which listing should begin.",
          },
          NextKeyMarker: {
            type: "string",
            description:
              "When a list is truncated, this element specifies the value that should be used for the key-marker request parameter in a subsequent request.",
          },
          Prefix: {
            type: "string",
            description:
              "When a prefix is provided in the request, this field contains the specified prefix.",
          },
          Delimiter: {
            type: "string",
            description: "Contains the delimiter you specified in the request.",
          },
          NextUploadIdMarker: {
            type: "string",
            description:
              "When a list is truncated, this element specifies the value that should be used for the upload-id-marker request parameter in a subsequent request.",
          },
          MaxUploads: {
            type: "number",
            description:
              "Maximum number of multipart uploads that could have been included in the response.",
          },
          IsTruncated: {
            type: "boolean",
            description:
              "Indicates whether the returned list of multipart uploads is truncated.",
          },
          Uploads: {
            type: "array",
            items: {
              type: "object",
              properties: {
                UploadId: {
                  type: "string",
                },
                Key: {
                  type: "string",
                },
                Initiated: {
                  type: "string",
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
                Initiator: {
                  type: "object",
                  properties: {
                    ID: {
                      type: "string",
                    },
                    DisplayName: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                ChecksumAlgorithm: {
                  type: "string",
                },
                ChecksumType: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "Container for elements related to a particular multipart upload.",
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
              "If you specify a delimiter in the request, then the result returns each distinct key prefix containing the delimiter in a CommonPrefixes element.",
          },
          EncodingType: {
            type: "string",
            description:
              "Encoding type used by Amazon S3 to encode object keys in the response.",
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

export default listMultipartUploads;
