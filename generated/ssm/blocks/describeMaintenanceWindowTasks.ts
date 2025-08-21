import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SSMClient,
  DescribeMaintenanceWindowTasksCommand,
} from "@aws-sdk/client-ssm";

const describeMaintenanceWindowTasks: AppBlock = {
  name: "Describe Maintenance Window Tasks",
  description: "Lists the tasks in a maintenance window.",
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
            "The ID of the maintenance window whose tasks should be retrieved.",
          type: "string",
          required: true,
        },
        Filters: {
          name: "Filters",
          description:
            "Optional filters used to narrow down the scope of the returned tasks.",
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

        const command = new DescribeMaintenanceWindowTasksCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Maintenance Window Tasks Result",
      description: "Result from DescribeMaintenanceWindowTasks operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Tasks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                WindowId: {
                  type: "string",
                },
                WindowTaskId: {
                  type: "string",
                },
                TaskArn: {
                  type: "string",
                },
                Type: {
                  type: "string",
                },
                Targets: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Key: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Values: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                TaskParameters: {
                  type: "object",
                  additionalProperties: {
                    type: "object",
                  },
                },
                Priority: {
                  type: "number",
                },
                LoggingInfo: {
                  type: "object",
                  properties: {
                    S3BucketName: {
                      type: "string",
                    },
                    S3KeyPrefix: {
                      type: "string",
                    },
                    S3Region: {
                      type: "string",
                    },
                  },
                  required: ["S3BucketName", "S3Region"],
                  additionalProperties: false,
                },
                ServiceRoleArn: {
                  type: "string",
                },
                MaxConcurrency: {
                  type: "string",
                },
                MaxErrors: {
                  type: "string",
                },
                Name: {
                  type: "string",
                },
                Description: {
                  type: "string",
                },
                CutoffBehavior: {
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
              },
              additionalProperties: false,
            },
            description:
              "Information about the tasks in the maintenance window.",
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

export default describeMaintenanceWindowTasks;
