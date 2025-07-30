import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SSMClient,
  DescribeMaintenanceWindowExecutionTaskInvocationsCommand,
} from "@aws-sdk/client-ssm";

const describeMaintenanceWindowExecutionTaskInvocations: AppBlock = {
  name: "Describe Maintenance Window Execution Task Invocations",
  description:
    "Retrieves the individual task executions (one per target) for a particular task run as part of a maintenance window execution.",
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
            "The ID of the maintenance window execution the task is part of.",
          type: "string",
          required: true,
        },
        TaskId: {
          name: "Task Id",
          description:
            "The ID of the specific task in the maintenance window task that should be retrieved.",
          type: "string",
          required: true,
        },
        Filters: {
          name: "Filters",
          description:
            "Optional filters used to scope down the returned task invocations.",
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
        });

        const command =
          new DescribeMaintenanceWindowExecutionTaskInvocationsCommand(
            commandInput as any,
          );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Maintenance Window Execution Task Invocations Result",
      description:
        "Result from DescribeMaintenanceWindowExecutionTaskInvocations operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          WindowExecutionTaskInvocationIdentities: {
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
                InvocationId: {
                  type: "string",
                },
                ExecutionId: {
                  type: "string",
                },
                TaskType: {
                  type: "string",
                },
                Parameters: {
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
                OwnerInformation: {
                  type: "string",
                },
                WindowTargetId: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "Information about the task invocation results per invocation.",
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

export default describeMaintenanceWindowExecutionTaskInvocations;
