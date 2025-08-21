import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  TestFunctionCommand,
} from "@aws-sdk/client-cloudfront";

const testFunction: AppBlock = {
  name: "Test Function",
  description: "Tests a CloudFront function.",
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
          description: "The name of the function that you are testing.",
          type: "string",
          required: true,
        },
        IfMatch: {
          name: "If Match",
          description:
            "The current version (ETag value) of the function that you are testing, which you can get using DescribeFunction.",
          type: "string",
          required: true,
        },
        Stage: {
          name: "Stage",
          description:
            "The stage of the function that you are testing, either DEVELOPMENT or LIVE.",
          type: "string",
          required: false,
        },
        EventObject: {
          name: "Event Object",
          description: "The event object to test the function with.",
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

        const command = new TestFunctionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Test Function Result",
      description: "Result from TestFunction operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TestResult: {
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
              },
              ComputeUtilization: {
                type: "string",
              },
              FunctionExecutionLogs: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              FunctionErrorMessage: {
                type: "string",
              },
              FunctionOutput: {
                type: "string",
              },
            },
            additionalProperties: false,
            description:
              "An object that represents the result of running the function with the provided event object.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default testFunction;
