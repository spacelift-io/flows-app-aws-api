import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SSMClient,
  DescribeMaintenanceWindowExecutionTasksCommand,
} from "@aws-sdk/client-ssm";

const describeMaintenanceWindowExecutionTasks: AppBlock = {
  name: "Describe Maintenance Window Execution Tasks",
  description:
    "For a given maintenance window execution, lists the tasks that were run.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        WindowExecutionId: {
          name: "Window Execution Id",
          description:
            "The ID of the maintenance window execution whose task executions should be retrieved.",
          type: "string",
          required: true,
        },
        Filters: {
          name: "Filters",
          description:
            "Optional filters used to scope down the returned tasks.",
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

        const command = new DescribeMaintenanceWindowExecutionTasksCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Maintenance Window Execution Tasks Result",
      description:
        "Result from DescribeMaintenanceWindowExecutionTasks operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          WindowExecutionTaskIdentities: {
            type: "array",
            items: {
              type: "object",
              properties: {
                WindowExecutionId: {
                  type: "string",
                },
                TaskExecutionId: {
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
                TaskArn: {
                  type: "string",
                },
                TaskType: {
                  type: "string",
                },
                AlarmConfiguration: {
                  type: "object",
                  properties: {
                    IgnorePollAlarmFailure: {
                      type: "boolean",
                    },
                    Alarms: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                  },
                  required: ["Alarms"],
                  additionalProperties: false,
                },
                TriggeredAlarms: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Name: {
                        type: "object",
                        additionalProperties: true,
                      },
                      State: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    required: ["Name", "State"],
                    additionalProperties: false,
                  },
                },
              },
              additionalProperties: false,
            },
            description: "Information about the task executions.",
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

export default describeMaintenanceWindowExecutionTasks;
