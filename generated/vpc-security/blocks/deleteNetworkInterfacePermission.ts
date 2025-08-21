import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DeleteNetworkInterfacePermissionCommand,
} from "@aws-sdk/client-ec2";

const deleteNetworkInterfacePermission: AppBlock = {
  name: "Delete Network Interface Permission",
  description: "Deletes a permission for a network interface.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        NetworkInterfacePermissionId: {
          name: "Network Interface Permission Id",
          description: "The ID of the network interface permission.",
          type: "string",
          required: true,
        },
        Force: {
          name: "Force",
          description:
            "Specify true to remove the permission even if the network interface is attached to an instance.",
          type: "boolean",
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

        const command = new DeleteNetworkInterfacePermissionCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Network Interface Permission Result",
      description: "Result from DeleteNetworkInterfacePermission operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Return: {
            type: "boolean",
            description:
              "Returns true if the request succeeds, otherwise returns an error.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteNetworkInterfacePermission;
