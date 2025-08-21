import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SSMClient,
  CancelMaintenanceWindowExecutionCommand,
} from "@aws-sdk/client-ssm";

const cancelMaintenanceWindowExecution: AppBlock = {
  name: "Cancel Maintenance Window Execution",
  description:
    "Stops a maintenance window execution that is already in progress and cancels any tasks in the window that haven't already starting running.",
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
          description: "The ID of the maintenance window execution to stop.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new CancelMaintenanceWindowExecutionCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Cancel Maintenance Window Execution Result",
      description: "Result from CancelMaintenanceWindowExecution operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          WindowExecutionId: {
            type: "string",
            description:
              "The ID of the maintenance window execution that has been stopped.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default cancelMaintenanceWindowExecution;
