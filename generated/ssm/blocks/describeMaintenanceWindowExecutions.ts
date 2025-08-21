import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SSMClient,
  DescribeMaintenanceWindowExecutionsCommand,
} from "@aws-sdk/client-ssm";

const describeMaintenanceWindowExecutions: AppBlock = {
  name: "Describe Maintenance Window Executions",
  description: "Lists the executions of a maintenance window.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        WindowId: {
          name: "Window Id",
          description:
            "The ID of the maintenance window whose executions should be retrieved.",
          type: "string",
          required: true,
        },
        Filters: {
          name: "Filters",
          description:
            "Each entry in the array is a structure containing: Key.",
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

        const command = new DescribeMaintenanceWindowExecutionsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Maintenance Window Executions Result",
      description: "Result from DescribeMaintenanceWindowExecutions operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          WindowExecutions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                WindowId: {
                  type: "string",
                },
                WindowExecutionId: {
                  type: "string",
                },
                Status: {
                  type: "string",
                },
                StatusDetails: {
                  type: "string",
                },
                StartTime: {
                  type: "string",
                },
                EndTime: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "Information about the maintenance window executions.",
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

export default describeMaintenanceWindowExecutions;
