import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SSMClient,
  DeregisterTargetFromMaintenanceWindowCommand,
} from "@aws-sdk/client-ssm";

const deregisterTargetFromMaintenanceWindow: AppBlock = {
  name: "Deregister Target From Maintenance Window",
  description: "Removes a target from a maintenance window.",
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
            "The ID of the maintenance window the target should be removed from.",
          type: "string",
          required: true,
        },
        WindowTargetId: {
          name: "Window Target Id",
          description: "The ID of the target definition to remove.",
          type: "string",
          required: true,
        },
        Safe: {
          name: "Safe",
          description:
            "The system checks if the target is being referenced by a task.",
          type: "boolean",
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

        const command = new DeregisterTargetFromMaintenanceWindowCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Deregister Target From Maintenance Window Result",
      description:
        "Result from DeregisterTargetFromMaintenanceWindow operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          WindowId: {
            type: "string",
            description:
              "The ID of the maintenance window the target was removed from.",
          },
          WindowTargetId: {
            type: "string",
            description: "The ID of the removed target definition.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deregisterTargetFromMaintenanceWindow;
