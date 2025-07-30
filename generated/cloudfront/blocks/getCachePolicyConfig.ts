import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  GetCachePolicyConfigCommand,
} from "@aws-sdk/client-cloudfront";

const getCachePolicyConfig: AppBlock = {
  name: "Get Cache Policy Config",
  description: "Gets a cache policy configuration.",
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

        const command = new GetCachePolicyConfigCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Cache Policy Config Result",
      description: "Result from GetCachePolicyConfig operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
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
                        type: "string",
                      },
                      Headers: {
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
                    },
                    required: ["HeaderBehavior"],
                    additionalProperties: false,
                  },
                  CookiesConfig: {
                    type: "object",
                    properties: {
                      CookieBehavior: {
                        type: "string",
                      },
                      Cookies: {
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
                    },
                    required: ["CookieBehavior"],
                    additionalProperties: false,
                  },
                  QueryStringsConfig: {
                    type: "object",
                    properties: {
                      QueryStringBehavior: {
                        type: "string",
                      },
                      QueryStrings: {
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
            description: "The cache policy configuration.",
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

export default getCachePolicyConfig;
