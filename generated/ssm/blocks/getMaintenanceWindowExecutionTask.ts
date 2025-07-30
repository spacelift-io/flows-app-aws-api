import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SSMClient,
  GetMaintenanceWindowExecutionTaskCommand,
} from "@aws-sdk/client-ssm";

const getMaintenanceWindowExecutionTask: AppBlock = {
  name: "Get Maintenance Window Execution Task",
  description:
    "Retrieves the details about a specific task run as part of a maintenance window execution.",
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
            "The ID of the maintenance window execution that includes the task.",
          type: "string",
          required: true,
        },
        TaskId: {
          name: "Task Id",
          description:
            "The ID of the specific task execution in the maintenance window task that should be retrieved.",
          type: "string",
          required: true,
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
        });

        const command = new GetMaintenanceWindowExecutionTaskCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Maintenance Window Execution Task Result",
      description: "Result from GetMaintenanceWindowExecutionTask operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          WindowExecutionId: {
            type: "string",
            description:
              "The ID of the maintenance window execution that includes the task.",
          },
          TaskExecutionId: {
            type: "string",
            description:
              "The ID of the specific task execution in the maintenance window task that was retrieved.",
          },
          TaskArn: {
            type: "string",
            description: "The Amazon Resource Name (ARN) of the task that ran.",
          },
          ServiceRole: {
            type: "string",
            description: "The role that was assumed when running the task.",
          },
          Type: {
            type: "string",
            description: "The type of task that was run.",
          },
          TaskParameters: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: {
                type: "object",
              },
            },
            description: "The parameters passed to the task when it was run.",
          },
          Priority: {
            type: "number",
            description: "The priority of the task.",
          },
          MaxConcurrency: {
            type: "string",
            description:
              "The defined maximum number of task executions that could be run in parallel.",
          },
          MaxErrors: {
            type: "string",
            description:
              "The defined maximum number of task execution errors allowed before scheduling of the task execution would have been stopped.",
          },
          Status: {
            type: "string",
            description: "The status of the task.",
          },
          StatusDetails: {
            type: "string",
            description: "The details explaining the status.",
          },
          StartTime: {
            type: "string",
            description: "The time the task execution started.",
          },
          EndTime: {
            type: "string",
            description: "The time the task execution completed.",
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
                  properties: {
                    Name: {
                      type: "string",
                    },
                  },
                  required: ["Name"],
                  additionalProperties: false,
                },
              },
            },
            required: ["Alarms"],
            additionalProperties: false,
            description:
              "The details for the CloudWatch alarm you applied to your maintenance window task.",
          },
          TriggeredAlarms: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: {
                  type: "string",
                },
                State: {
                  type: "string",
                },
              },
              required: ["Name", "State"],
              additionalProperties: false,
            },
            description:
              "The CloudWatch alarms that were invoked by the maintenance window task.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getMaintenanceWindowExecutionTask;
