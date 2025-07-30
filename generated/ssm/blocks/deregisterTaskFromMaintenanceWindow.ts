import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SSMClient,
  DeregisterTaskFromMaintenanceWindowCommand,
} from "@aws-sdk/client-ssm";

const deregisterTaskFromMaintenanceWindow: AppBlock = {
  name: "Deregister Task From Maintenance Window",
  description: "Removes a task from a maintenance window.",
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
            "The ID of the maintenance window the task should be removed from.",
          type: "string",
          required: true,
        },
        WindowTaskId: {
          name: "Window Task Id",
          description:
            "The ID of the task to remove from the maintenance window.",
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

        const command = new DeregisterTaskFromMaintenanceWindowCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Deregister Task From Maintenance Window Result",
      description: "Result from DeregisterTaskFromMaintenanceWindow operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          WindowId: {
            type: "string",
            description:
              "The ID of the maintenance window the task was removed from.",
          },
          WindowTaskId: {
            type: "string",
            description:
              "The ID of the task removed from the maintenance window.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deregisterTaskFromMaintenanceWindow;
