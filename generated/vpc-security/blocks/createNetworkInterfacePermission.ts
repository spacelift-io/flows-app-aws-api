import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  CreateNetworkInterfacePermissionCommand,
} from "@aws-sdk/client-ec2";

const createNetworkInterfacePermission: AppBlock = {
  name: "Create Network Interface Permission",
  description:
    "Grants an Amazon Web Services-authorized account permission to attach the specified network interface to an instance in their account.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        NetworkInterfaceId: {
          name: "Network Interface Id",
          description: "The ID of the network interface.",
          type: "string",
          required: true,
        },
        AwsAccountId: {
          name: "Aws Account Id",
          description: "The Amazon Web Services account ID.",
          type: "string",
          required: false,
        },
        AwsService: {
          name: "Aws Service",
          description: "The Amazon Web Services service.",
          type: "string",
          required: false,
        },
        Permission: {
          name: "Permission",
          description: "The type of permission to grant.",
          type: "string",
          required: true,
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
        });

        const command = new CreateNetworkInterfacePermissionCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Network Interface Permission Result",
      description: "Result from CreateNetworkInterfacePermission operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          InterfacePermission: {
            type: "object",
            properties: {
              NetworkInterfacePermissionId: {
                type: "string",
              },
              NetworkInterfaceId: {
                type: "string",
              },
              AwsAccountId: {
                type: "string",
              },
              AwsService: {
                type: "string",
              },
              Permission: {
                type: "string",
              },
              PermissionState: {
                type: "object",
                properties: {
                  State: {
                    type: "string",
                  },
                  StatusMessage: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
            },
            additionalProperties: false,
            description:
              "Information about the permission for the network interface.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createNetworkInterfacePermission;
