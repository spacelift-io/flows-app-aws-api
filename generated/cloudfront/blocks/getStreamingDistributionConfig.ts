import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  GetStreamingDistributionConfigCommand,
} from "@aws-sdk/client-cloudfront";

const getStreamingDistributionConfig: AppBlock = {
  name: "Get Streaming Distribution Config",
  description:
    "Get the configuration information about a streaming distribution.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Id: {
          name: "Id",
          description: "The streaming distribution's ID.",
          type: "string",
          required: true,
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

        const command = new GetStreamingDistributionConfigCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Streaming Distribution Config Result",
      description: "Result from GetStreamingDistributionConfig operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
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
            description:
              "The streaming distribution's configuration information.",
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

export default getStreamingDistributionConfig;
