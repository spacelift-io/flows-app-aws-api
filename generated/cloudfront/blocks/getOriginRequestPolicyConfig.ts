import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  GetOriginRequestPolicyConfigCommand,
} from "@aws-sdk/client-cloudfront";

const getOriginRequestPolicyConfig: AppBlock = {
  name: "Get Origin Request Policy Config",
  description: "Gets an origin request policy configuration.",
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
          description: "The unique identifier for the origin request policy.",
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

        const command = new GetOriginRequestPolicyConfigCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Origin Request Policy Config Result",
      description: "Result from GetOriginRequestPolicyConfig operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          OriginRequestPolicyConfig: {
            type: "object",
            properties: {
              Comment: {
                type: "string",
              },
              Name: {
                type: "string",
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
                },
                required: ["QueryStringBehavior"],
                additionalProperties: false,
              },
            },
            required: [
              "Name",
              "HeadersConfig",
              "CookiesConfig",
              "QueryStringsConfig",
            ],
            additionalProperties: false,
            description: "The origin request policy configuration.",
          },
          ETag: {
            type: "string",
            description: "The current version of the origin request policy.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getOriginRequestPolicyConfig;
