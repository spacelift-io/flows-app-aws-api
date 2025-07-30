import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SSMClient,
  GetMaintenanceWindowExecutionTaskInvocationCommand,
} from "@aws-sdk/client-ssm";

const getMaintenanceWindowExecutionTaskInvocation: AppBlock = {
  name: "Get Maintenance Window Execution Task Invocation",
  description:
    "Retrieves information about a specific task running on a specific target.",
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
            "The ID of the maintenance window execution for which the task is a part.",
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
        InvocationId: {
          name: "Invocation Id",
          description: "The invocation ID to retrieve.",
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

        const command = new GetMaintenanceWindowExecutionTaskInvocationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Maintenance Window Execution Task Invocation Result",
      description:
        "Result from GetMaintenanceWindowExecutionTaskInvocation operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          WindowExecutionId: {
            type: "string",
            description: "The maintenance window execution ID.",
          },
          TaskExecutionId: {
            type: "string",
            description: "The task execution ID.",
          },
          InvocationId: {
            type: "string",
            description: "The invocation ID.",
          },
          ExecutionId: {
            type: "string",
            description: "The execution ID.",
          },
          TaskType: {
            type: "string",
            description: "Retrieves the task type for a maintenance window.",
          },
          Parameters: {
            type: "string",
            description: "The parameters used at the time that the task ran.",
          },
          Status: {
            type: "string",
            description: "The task status for an invocation.",
          },
          StatusDetails: {
            type: "string",
            description: "The details explaining the status.",
          },
          StartTime: {
            type: "string",
            description:
              "The time that the task started running on the target.",
          },
          EndTime: {
            type: "string",
            description:
              "The time that the task finished running on the target.",
          },
          OwnerInformation: {
            type: "string",
            description:
              "User-provided value to be included in any Amazon CloudWatch Events or Amazon EventBridge events raised while running tasks for these targets in this maintenance window.",
          },
          WindowTargetId: {
            type: "string",
            description: "The maintenance window target ID.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getMaintenanceWindowExecutionTaskInvocation;
