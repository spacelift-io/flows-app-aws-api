import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SSMClient,
  DescribeMaintenanceWindowScheduleCommand,
} from "@aws-sdk/client-ssm";

const describeMaintenanceWindowSchedule: AppBlock = {
  name: "Describe Maintenance Window Schedule",
  description:
    "Retrieves information about upcoming executions of a maintenance window.",
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
            "The ID of the maintenance window to retrieve information about.",
          type: "string",
          required: false,
        },
        Targets: {
          name: "Targets",
          description:
            "The managed node ID or key-value pair to retrieve information about.",
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
        ResourceType: {
          name: "Resource Type",
          description:
            "The type of resource you want to retrieve information about.",
          type: "string",
          required: false,
        },
        Filters: {
          name: "Filters",
          description: "Filters used to limit the range of results.",
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

        const command = new DescribeMaintenanceWindowScheduleCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Maintenance Window Schedule Result",
      description: "Result from DescribeMaintenanceWindowSchedule operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ScheduledWindowExecutions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                WindowId: {
                  type: "string",
                },
                Name: {
                  type: "string",
                },
                ExecutionTime: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "Information about maintenance window executions scheduled for the specified time range.",
          },
          NextToken: {
            type: "string",
            description: "The token for the next set of items to return.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeMaintenanceWindowSchedule;
