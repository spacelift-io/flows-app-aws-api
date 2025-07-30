import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  GetCachePolicyCommand,
} from "@aws-sdk/client-cloudfront";

const getCachePolicy: AppBlock = {
  name: "Get Cache Policy",
  description:
    "Gets a cache policy, including the following metadata: The policy's identifier.",
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
          description: "The unique identifier for the cache policy.",
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

        const command = new GetCachePolicyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Cache Policy Result",
      description: "Result from GetCachePolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          CachePolicy: {
            type: "object",
            properties: {
              Id: {
                type: "string",
              },
              LastModifiedTime: {
                type: "string",
              },
              CachePolicyConfig: {
                type: "object",
                properties: {
                  Comment: {
                    type: "string",
                  },
                  Name: {
                    type: "string",
                  },
                  DefaultTTL: {
                    type: "number",
                  },
                  MaxTTL: {
                    type: "number",
                  },
                  MinTTL: {
                    type: "number",
                  },
                  ParametersInCacheKeyAndForwardedToOrigin: {
                    type: "object",
                    properties: {
                      EnableAcceptEncodingGzip: {
                        type: "boolean",
                      },
                      EnableAcceptEncodingBrotli: {
                        type: "boolean",
                      },
                      HeadersConfig: {
                        type: "object",
                        properties: {
                          HeaderBehavior: {
                            type: "object",
                            additionalProperties: true,
                          },
                          Headers: {
                            type: "object",
                            additionalProperties: true,
                          },
                        },
                        required: ["HeaderBehavior"],
                        additionalProperties: false,
                      },
                      CookiesConfig: {
                        type: "object",
                        properties: {
                          CookieBehavior: {
                            type: "object",
                            additionalProperties: true,
                          },
                          Cookies: {
                            type: "object",
                            additionalProperties: true,
                          },
                        },
                        required: ["CookieBehavior"],
                        additionalProperties: false,
                      },
                      QueryStringsConfig: {
                        type: "object",
                        properties: {
                          QueryStringBehavior: {
                            type: "object",
                            additionalProperties: true,
                          },
                          QueryStrings: {
                            type: "object",
                            additionalProperties: true,
                          },
                        },
                        required: ["QueryStringBehavior"],
                        additionalProperties: false,
                      },
                    },
                    required: [
                      "EnableAcceptEncodingGzip",
                      "HeadersConfig",
                      "CookiesConfig",
                      "QueryStringsConfig",
                    ],
                    additionalProperties: false,
                  },
                },
                required: ["Name", "MinTTL"],
                additionalProperties: false,
              },
            },
            required: ["Id", "LastModifiedTime", "CachePolicyConfig"],
            additionalProperties: false,
            description: "The cache policy.",
          },
          ETag: {
            type: "string",
            description: "The current version of the cache policy.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getCachePolicy;
