import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, DescribeParametersCommand } from "@aws-sdk/client-ssm";

const describeParameters: AppBlock = {
  name: "Describe Parameters",
  description:
    "Lists the parameters in your Amazon Web Services account or the parameters shared with you when you enable the Shared option.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Filters: {
          name: "Filters",
          description: "This data type is deprecated.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Key: {
                  type: "string",
                },
                Values: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              required: ["Key", "Values"],
              additionalProperties: false,
            },
          },
          required: false,
        },
        ParameterFilters: {
          name: "Parameter Filters",
          description: "Filters to limit the request results.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Key: {
                  type: "string",
                },
                Option: {
                  type: "string",
                },
                Values: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              required: ["Key"],
              additionalProperties: false,
            },
          },
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description: "The maximum number of items to return for this call.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token for the next set of items to return.",
          type: "string",
          required: false,
        },
        Shared: {
          name: "Shared",
          description: "Lists parameters that are shared with you.",
          type: "boolean",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new SSMClient({
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

        const command = new DescribeParametersCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Parameters Result",
      description: "Result from DescribeParameters operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Parameters: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: {
                  type: "string",
                },
                ARN: {
                  type: "string",
                },
                Type: {
                  type: "string",
                },
                KeyId: {
                  type: "string",
                },
                LastModifiedDate: {
                  type: "string",
                },
                LastModifiedUser: {
                  type: "string",
                },
                Description: {
                  type: "string",
                },
                AllowedPattern: {
                  type: "string",
                },
                Version: {
                  type: "number",
                },
                Tier: {
                  type: "string",
                },
                Policies: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      PolicyText: {
                        type: "object",
                        additionalProperties: true,
                      },
                      PolicyType: {
                        type: "object",
                        additionalProperties: true,
                      },
                      PolicyStatus: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                DataType: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "Parameters returned by the request.",
          },
          NextToken: {
            type: "string",
            description:
              "The token to use when requesting the next set of items.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeParameters;
