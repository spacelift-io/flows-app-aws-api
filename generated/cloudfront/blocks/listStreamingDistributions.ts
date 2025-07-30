import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  ListStreamingDistributionsCommand,
} from "@aws-sdk/client-cloudfront";

const listStreamingDistributions: AppBlock = {
  name: "List Streaming Distributions",
  description: "List streaming distributions.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Marker: {
          name: "Marker",
          description:
            "The value that you provided for the Marker request parameter.",
          type: "string",
          required: false,
        },
        MaxItems: {
          name: "Max Items",
          description:
            "The value that you provided for the MaxItems request parameter.",
          type: "number",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudFrontClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new ListStreamingDistributionsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Streaming Distributions Result",
      description: "Result from ListStreamingDistributions operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          StreamingDistributionList: {
            type: "object",
            properties: {
              Marker: {
                type: "string",
              },
              NextMarker: {
                type: "string",
              },
              MaxItems: {
                type: "number",
              },
              IsTruncated: {
                type: "boolean",
              },
              Quantity: {
                type: "number",
              },
              Items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Id: {
                      type: "string",
                    },
                    ARN: {
                      type: "string",
                    },
                    Status: {
                      type: "string",
                    },
                    LastModifiedTime: {
                      type: "string",
                    },
                    DomainName: {
                      type: "string",
                    },
                    S3Origin: {
                      type: "object",
                      properties: {
                        DomainName: {
                          type: "object",
                          additionalProperties: true,
                        },
                        OriginAccessIdentity: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["DomainName", "OriginAccessIdentity"],
                      additionalProperties: false,
                    },
                    Aliases: {
                      type: "object",
                      properties: {
                        Quantity: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Items: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["Quantity"],
                      additionalProperties: false,
                    },
                    TrustedSigners: {
                      type: "object",
                      properties: {
                        Enabled: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Quantity: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Items: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["Enabled", "Quantity"],
                      additionalProperties: false,
                    },
                    Comment: {
                      type: "string",
                    },
                    PriceClass: {
                      type: "string",
                    },
                    Enabled: {
                      type: "boolean",
                    },
                  },
                  required: [
                    "Id",
                    "ARN",
                    "Status",
                    "LastModifiedTime",
                    "DomainName",
                    "S3Origin",
                    "Aliases",
                    "TrustedSigners",
                    "Comment",
                    "PriceClass",
                    "Enabled",
                  ],
                  additionalProperties: false,
                },
              },
            },
            required: ["Marker", "MaxItems", "IsTruncated", "Quantity"],
            additionalProperties: false,
            description: "The StreamingDistributionList type.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listStreamingDistributions;
