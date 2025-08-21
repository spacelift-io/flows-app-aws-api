import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  CreateFunctionCommand,
} from "@aws-sdk/client-cloudfront";

const createFunction: AppBlock = {
  name: "Create Function",
  description: "Creates a CloudFront function.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Name: {
          name: "Name",
          description: "A name to identify the function.",
          type: "string",
          required: true,
        },
        FunctionConfig: {
          name: "Function Config",
          description:
            "Configuration information about the function, including an optional comment and the function's runtime.",
          type: {
            type: "object",
            properties: {
              Comment: {
                type: "string",
              },
              Runtime: {
                type: "string",
              },
              KeyValueStoreAssociations: {
                type: "object",
                properties: {
                  Quantity: {
                    type: "number",
                  },
                  Items: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        KeyValueStoreARN: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["KeyValueStoreARN"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["Quantity"],
                additionalProperties: false,
              },
            },
            required: ["Comment", "Runtime"],
            additionalProperties: false,
          },
          required: true,
        },
        FunctionCode: {
          name: "Function Code",
          description: "The function code.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new CreateFunctionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Function Result",
      description: "Result from CreateFunction operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          FunctionSummary: {
            type: "object",
            properties: {
              Name: {
                type: "string",
              },
              Status: {
                type: "string",
              },
              FunctionConfig: {
                type: "object",
                properties: {
                  Comment: {
                    type: "string",
                  },
                  Runtime: {
                    type: "string",
                  },
                  KeyValueStoreAssociations: {
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
                required: ["Comment", "Runtime"],
                additionalProperties: false,
              },
              FunctionMetadata: {
                type: "object",
                properties: {
                  FunctionARN: {
                    type: "string",
                  },
                  Stage: {
                    type: "string",
                  },
                  CreatedTime: {
                    type: "string",
                  },
                  LastModifiedTime: {
                    type: "string",
                  },
                },
                required: ["FunctionARN", "LastModifiedTime"],
                additionalProperties: false,
              },
            },
            required: ["Name", "FunctionConfig", "FunctionMetadata"],
            additionalProperties: false,
            description:
              "Contains configuration information and metadata about a CloudFront function.",
          },
          Location: {
            type: "string",
            description: "The URL of the CloudFront function.",
          },
          ETag: {
            type: "string",
            description:
              "The version identifier for the current version of the CloudFront function.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createFunction;
