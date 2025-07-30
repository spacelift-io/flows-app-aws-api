import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SSMClient,
  GetMaintenanceWindowExecutionCommand,
} from "@aws-sdk/client-ssm";

const getMaintenanceWindowExecution: AppBlock = {
  name: "Get Maintenance Window Execution",
  description:
    "Retrieves details about a specific a maintenance window execution.",
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

        const command = new GetMaintenanceWindowExecutionCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Maintenance Window Execution Result",
      description: "Result from GetMaintenanceWindowExecution operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          WindowExecutionId: {
            type: "string",
            description: "The ID of the maintenance window execution.",
          },
          TaskIds: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "The ID of the task executions from the maintenance window execution.",
          },
          Status: {
            type: "string",
            description: "The status of the maintenance window execution.",
          },
          StatusDetails: {
            type: "string",
            description: "The details explaining the status.",
          },
          StartTime: {
            type: "string",
            description: "The time the maintenance window started running.",
          },
          EndTime: {
            type: "string",
            description: "The time the maintenance window finished running.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getMaintenanceWindowExecution;
