import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  ModifyInstanceMaintenanceOptionsCommand,
} from "@aws-sdk/client-ec2";

const modifyInstanceMaintenanceOptions: AppBlock = {
  name: "Modify Instance Maintenance Options",
  description:
    "Modifies the recovery behavior of your instance to disable simplified automatic recovery or set the recovery behavior to default.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        InstanceId: {
          name: "Instance Id",
          description: "The ID of the instance.",
          type: "string",
          required: true,
        },
        AutoRecovery: {
          name: "Auto Recovery",
          description:
            "Disables the automatic recovery behavior of your instance or sets it to default.",
          type: "string",
          required: false,
        },
        RebootMigration: {
          name: "Reboot Migration",
          description:
            "Specifies whether to attempt reboot migration during a user-initiated reboot of an instance that has a scheduled system-reboot event: default - Amazon EC2 attempts to migrate the instance to new hardware (reboot migration).",
          type: "string",
          required: false,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the action, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new EC2Client({
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

        const command = new ModifyInstanceMaintenanceOptionsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Instance Maintenance Options Result",
      description: "Result from ModifyInstanceMaintenanceOptions operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          InstanceId: {
            type: "string",
            description: "The ID of the instance.",
          },
          AutoRecovery: {
            type: "string",
            description:
              "Provides information on the current automatic recovery behavior of your instance.",
          },
          RebootMigration: {
            type: "string",
            description:
              "Specifies whether to attempt reboot migration during a user-initiated reboot of an instance that has a scheduled system-reboot event: default - Amazon EC2 attempts to migrate the instance to new hardware (reboot migration).",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default modifyInstanceMaintenanceOptions;
