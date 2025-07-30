import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  DescribeFunctionCommand,
} from "@aws-sdk/client-cloudfront";

const describeFunction: AppBlock = {
  name: "Describe Function",
  description:
    "Gets configuration information and metadata about a CloudFront function, but not the function's code.",
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
          description:
            "The name of the function that you are getting information about.",
          type: "string",
          required: true,
        },
        Stage: {
          name: "Stage",
          description: "The function's stage, either DEVELOPMENT or LIVE.",
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

        const command = new DescribeFunctionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Function Result",
      description: "Result from DescribeFunction operation",
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

export default describeFunction;
