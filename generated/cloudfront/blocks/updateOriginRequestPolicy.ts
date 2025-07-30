import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  UpdateOriginRequestPolicyCommand,
} from "@aws-sdk/client-cloudfront";

const updateOriginRequestPolicy: AppBlock = {
  name: "Update Origin Request Policy",
  description: "Updates an origin request policy configuration.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        OriginRequestPolicyConfig: {
          name: "Origin Request Policy Config",
          description: "An origin request policy configuration.",
          type: {
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
          },
          required: true,
        },
        Id: {
          name: "Id",
          description:
            "The unique identifier for the origin request policy that you are updating.",
          type: "string",
          required: true,
        },
        IfMatch: {
          name: "If Match",
          description:
            "The version of the origin request policy that you are updating.",
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

        const command = new UpdateOriginRequestPolicyCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Origin Request Policy Result",
      description: "Result from UpdateOriginRequestPolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          OriginRequestPolicy: {
            type: "object",
            properties: {
              Id: {
                type: "string",
              },
              LastModifiedTime: {
                type: "string",
              },
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
                  "Name",
                  "HeadersConfig",
                  "CookiesConfig",
                  "QueryStringsConfig",
                ],
                additionalProperties: false,
              },
            },
            required: ["Id", "LastModifiedTime", "OriginRequestPolicyConfig"],
            additionalProperties: false,
            description: "An origin request policy.",
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

export default updateOriginRequestPolicy;
