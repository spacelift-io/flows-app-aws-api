import { AppBlock, events } from "@slflows/sdk/v1";
import { S3Client, GetBucketWebsiteCommand } from "@aws-sdk/client-s3";
import { serializeAWSResponse } from "../utils/serialize";

const getBucketWebsite: AppBlock = {
  name: "Get Bucket Website",
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
            "The bucket name for which to get the website configuration.",
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

        const command = new GetBucketWebsiteCommand(commandInput as any);
        const response = await client.send(command);

        // Safely serialize response by handling circular references and streams
        const safeResponse = await serializeAWSResponse(response);
        await events.emit(safeResponse || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Bucket Website Result",
      description: "Result from GetBucketWebsite operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          RedirectAllRequestsTo: {
            type: "object",
            properties: {
              HostName: {
                type: "string",
              },
              Protocol: {
                type: "string",
              },
            },
            required: ["HostName"],
            additionalProperties: false,
            description:
              "Specifies the redirect behavior of all requests to a website endpoint of an Amazon S3 bucket.",
          },
          IndexDocument: {
            type: "object",
            properties: {
              Suffix: {
                type: "string",
              },
            },
            required: ["Suffix"],
            additionalProperties: false,
            description:
              "The name of the index document for the website (for example index.",
          },
          ErrorDocument: {
            type: "object",
            properties: {
              Key: {
                type: "string",
              },
            },
            required: ["Key"],
            additionalProperties: false,
            description:
              "The object key name of the website error document to use for 4XX class errors.",
          },
          RoutingRules: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Condition: {
                  type: "object",
                  properties: {
                    HttpErrorCodeReturnedEquals: {
                      type: "string",
                    },
                    KeyPrefixEquals: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                Redirect: {
                  type: "object",
                  properties: {
                    HostName: {
                      type: "string",
                    },
                    HttpRedirectCode: {
                      type: "string",
                    },
                    Protocol: {
                      type: "string",
                    },
                    ReplaceKeyPrefixWith: {
                      type: "string",
                    },
                    ReplaceKeyWith: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              required: ["Redirect"],
              additionalProperties: false,
            },
            description:
              "Rules that define when a redirect is applied and the redirect behavior.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getBucketWebsite;
