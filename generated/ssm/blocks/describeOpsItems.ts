import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, DescribeOpsItemsCommand } from "@aws-sdk/client-ssm";

const describeOpsItems: AppBlock = {
  name: "Describe Ops Items",
  description: "Query a set of OpsItems.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        OpsItemFilters: {
          name: "Ops Item Filters",
          description: "One or more filters to limit the response.",
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
                Operator: {
                  type: "string",
                },
              },
              required: ["Key", "Values", "Operator"],
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
          description: "A token to start the list.",
          type: "string",
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

        const command = new DescribeOpsItemsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Ops Items Result",
      description: "Result from DescribeOpsItems operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NextToken: {
            type: "string",
            description: "The token for the next set of items to return.",
          },
          OpsItemSummaries: {
            type: "array",
            items: {
              type: "object",
              properties: {
                CreatedBy: {
                  type: "string",
                },
                CreatedTime: {
                  type: "string",
                },
                LastModifiedBy: {
                  type: "string",
                },
                LastModifiedTime: {
                  type: "string",
                },
                Priority: {
                  type: "number",
                },
                Source: {
                  type: "string",
                },
                Status: {
                  type: "string",
                },
                OpsItemId: {
                  type: "string",
                },
                Title: {
                  type: "string",
                },
                OperationalData: {
                  type: "object",
                  additionalProperties: {
                    type: "object",
                  },
                },
                Category: {
                  type: "string",
                },
                Severity: {
                  type: "string",
                },
                OpsItemType: {
                  type: "string",
                },
                ActualStartTime: {
                  type: "string",
                },
                ActualEndTime: {
                  type: "string",
                },
                PlannedStartTime: {
                  type: "string",
                },
                PlannedEndTime: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "A list of OpsItems.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeOpsItems;
