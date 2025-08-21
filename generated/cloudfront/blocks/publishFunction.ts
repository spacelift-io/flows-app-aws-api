import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  PublishFunctionCommand,
} from "@aws-sdk/client-cloudfront";

const publishFunction: AppBlock = {
  name: "Publish Function",
  description:
    "Publishes a CloudFront function by copying the function code from the DEVELOPMENT stage to LIVE.",
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
          description: "The name of the function that you are publishing.",
          type: "string",
          required: true,
        },
        IfMatch: {
          name: "If Match",
          description:
            "The current version (ETag value) of the function that you are publishing, which you can get using DescribeFunction.",
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

        const command = new PublishFunctionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Publish Function Result",
      description: "Result from PublishFunction operation",
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
        },
        additionalProperties: true,
      },
    },
  },
};

export default publishFunction;
