import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  UpdateStreamingDistributionCommand,
} from "@aws-sdk/client-cloudfront";

const updateStreamingDistribution: AppBlock = {
  name: "Update Streaming Distribution",
  description: "Update a streaming distribution.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        StreamingDistributionConfig: {
          name: "Streaming Distribution Config",
          description:
            "The streaming distribution's configuration information.",
          type: {
            type: "object",
            properties: {
              CallerReference: {
                type: "string",
              },
              S3Origin: {
                type: "object",
                properties: {
                  DomainName: {
                    type: "string",
                  },
                  OriginAccessIdentity: {
                    type: "string",
                  },
                },
                required: ["DomainName", "OriginAccessIdentity"],
                additionalProperties: false,
              },
              Aliases: {
                type: "object",
                properties: {
                  Quantity: {
                    type: "number",
                  },
                  Items: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                },
                required: ["Quantity"],
                additionalProperties: false,
              },
              Comment: {
                type: "string",
              },
              Logging: {
                type: "object",
                properties: {
                  Enabled: {
                    type: "boolean",
                  },
                  Bucket: {
                    type: "string",
                  },
                  Prefix: {
                    type: "string",
                  },
                },
                required: ["Enabled", "Bucket", "Prefix"],
                additionalProperties: false,
              },
              TrustedSigners: {
                type: "object",
                properties: {
                  Enabled: {
                    type: "boolean",
                  },
                  Quantity: {
                    type: "number",
                  },
                  Items: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                },
                required: ["Enabled", "Quantity"],
                additionalProperties: false,
              },
              PriceClass: {
                type: "string",
              },
              Enabled: {
                type: "boolean",
              },
            },
            required: [
              "CallerReference",
              "S3Origin",
              "Comment",
              "TrustedSigners",
              "Enabled",
            ],
            additionalProperties: false,
          },
          required: true,
        },
        Id: {
          name: "Id",
          description: "The streaming distribution's id.",
          type: "string",
          required: true,
        },
        IfMatch: {
          name: "If Match",
          description:
            "The value of the ETag header that you received when retrieving the streaming distribution's configuration.",
          type: "string",
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

        const command = new UpdateStreamingDistributionCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Streaming Distribution Result",
      description: "Result from UpdateStreamingDistribution operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          StreamingDistribution: {
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
              ActiveTrustedSigners: {
                type: "object",
                properties: {
                  Enabled: {
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
                        AwsAccountNumber: {
                          type: "object",
                          additionalProperties: true,
                        },
                        KeyPairIds: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                },
                required: ["Enabled", "Quantity"],
                additionalProperties: false,
              },
              StreamingDistributionConfig: {
                type: "object",
                properties: {
                  CallerReference: {
                    type: "string",
                  },
                  S3Origin: {
                    type: "object",
                    properties: {
                      DomainName: {
                        type: "string",
                      },
                      OriginAccessIdentity: {
                        type: "string",
                      },
                    },
                    required: ["DomainName", "OriginAccessIdentity"],
                    additionalProperties: false,
                  },
                  Aliases: {
                    type: "object",
                    properties: {
                      Quantity: {
                        type: "number",
                      },
                      Items: {
                        type: "array",
                        items: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                    },
                    required: ["Quantity"],
                    additionalProperties: false,
                  },
                  Comment: {
                    type: "string",
                  },
                  Logging: {
                    type: "object",
                    properties: {
                      Enabled: {
                        type: "boolean",
                      },
                      Bucket: {
                        type: "string",
                      },
                      Prefix: {
                        type: "string",
                      },
                    },
                    required: ["Enabled", "Bucket", "Prefix"],
                    additionalProperties: false,
                  },
                  TrustedSigners: {
                    type: "object",
                    properties: {
                      Enabled: {
                        type: "boolean",
                      },
                      Quantity: {
                        type: "number",
                      },
                      Items: {
                        type: "array",
                        items: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                    },
                    required: ["Enabled", "Quantity"],
                    additionalProperties: false,
                  },
                  PriceClass: {
                    type: "string",
                  },
                  Enabled: {
                    type: "boolean",
                  },
                },
                required: [
                  "CallerReference",
                  "S3Origin",
                  "Comment",
                  "TrustedSigners",
                  "Enabled",
                ],
                additionalProperties: false,
              },
            },
            required: [
              "Id",
              "ARN",
              "Status",
              "DomainName",
              "ActiveTrustedSigners",
              "StreamingDistributionConfig",
            ],
            additionalProperties: false,
            description: "The streaming distribution's information.",
          },
          ETag: {
            type: "string",
            description: "The current version of the configuration.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateStreamingDistribution;
