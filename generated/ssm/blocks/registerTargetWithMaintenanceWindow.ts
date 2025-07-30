import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SSMClient,
  RegisterTargetWithMaintenanceWindowCommand,
} from "@aws-sdk/client-ssm";

const registerTargetWithMaintenanceWindow: AppBlock = {
  name: "Register Target With Maintenance Window",
  description: "Registers a target with a maintenance window.",
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
            "The ID of the maintenance window the target should be registered with.",
          type: "string",
          required: true,
        },
        ResourceType: {
          name: "Resource Type",
          description:
            "The type of target being registered with the maintenance window.",
          type: "string",
          required: true,
        },
        Targets: {
          name: "Targets",
          description: "The targets to register with the maintenance window.",
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
          required: true,
        },
        OwnerInformation: {
          name: "Owner Information",
          description:
            "User-provided value that will be included in any Amazon CloudWatch Events events raised while running tasks for these targets in this maintenance window.",
          type: "string",
          required: false,
        },
        Name: {
          name: "Name",
          description: "An optional name for the target.",
          type: "string",
          required: false,
        },
        Description: {
          name: "Description",
          description: "An optional description for the target.",
          type: "string",
          required: false,
        },
        ClientToken: {
          name: "Client Token",
          description: "User-provided idempotency token.",
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

        const command = new RegisterTargetWithMaintenanceWindowCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Register Target With Maintenance Window Result",
      description: "Result from RegisterTargetWithMaintenanceWindow operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          WindowTargetId: {
            type: "string",
            description:
              "The ID of the target definition in this maintenance window.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default registerTargetWithMaintenanceWindow;
