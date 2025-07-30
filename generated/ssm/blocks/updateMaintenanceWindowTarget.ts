import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SSMClient,
  UpdateMaintenanceWindowTargetCommand,
} from "@aws-sdk/client-ssm";

const updateMaintenanceWindowTarget: AppBlock = {
  name: "Update Maintenance Window Target",
  description: "Modifies the target of an existing maintenance window.",
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
            "The maintenance window ID with which to modify the target.",
          type: "string",
          required: true,
        },
        WindowTargetId: {
          name: "Window Target Id",
          description: "The target ID to modify.",
          type: "string",
          required: true,
        },
        Targets: {
          name: "Targets",
          description: "The targets to add or replace.",
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
        OwnerInformation: {
          name: "Owner Information",
          description:
            "User-provided value that will be included in any Amazon CloudWatch Events events raised while running tasks for these targets in this maintenance window.",
          type: "string",
          required: false,
        },
        Name: {
          name: "Name",
          description: "A name for the update.",
          type: "string",
          required: false,
        },
        Description: {
          name: "Description",
          description: "An optional description for the update.",
          type: "string",
          required: false,
        },
        Replace: {
          name: "Replace",
          description:
            "If True, then all fields that are required by the RegisterTargetWithMaintenanceWindow operation are also required for this API request.",
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

        const command = new UpdateMaintenanceWindowTargetCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Maintenance Window Target Result",
      description: "Result from UpdateMaintenanceWindowTarget operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          WindowId: {
            type: "string",
            description:
              "The maintenance window ID specified in the update request.",
          },
          WindowTargetId: {
            type: "string",
            description: "The target ID specified in the update request.",
          },
          Targets: {
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
            description: "The updated targets.",
          },
          OwnerInformation: {
            type: "string",
            description: "The updated owner.",
          },
          Name: {
            type: "string",
            description: "The updated name.",
          },
          Description: {
            type: "string",
            description: "The updated description.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateMaintenanceWindowTarget;
