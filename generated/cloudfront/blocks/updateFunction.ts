import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  UpdateFunctionCommand,
} from "@aws-sdk/client-cloudfront";

const updateFunction: AppBlock = {
  name: "Update Function",
  description: "Updates a CloudFront function.",
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
          description: "The name of the function that you are updating.",
          type: "string",
          required: true,
        },
        IfMatch: {
          name: "If Match",
          description:
            "The current version (ETag value) of the function that you are updating, which you can get using DescribeFunction.",
          type: "string",
          required: true,
        },
        FunctionConfig: {
          name: "Function Config",
          description: "Configuration information about the function.",
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
        });

        const command = new UpdateFunctionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Function Result",
      description: "Result from UpdateFunction operation",
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

export default updateFunction;
