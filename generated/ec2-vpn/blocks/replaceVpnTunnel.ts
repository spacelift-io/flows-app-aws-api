import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, ReplaceVpnTunnelCommand } from "@aws-sdk/client-ec2";

const replaceVpnTunnel: AppBlock = {
  name: "Replace Vpn Tunnel",
  description: "Trigger replacement of specified VPN tunnel.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        VpnConnectionId: {
          name: "Vpn Connection Id",
          description: "The ID of the Site-to-Site VPN connection.",
          type: "string",
          required: true,
        },
        VpnTunnelOutsideIpAddress: {
          name: "Vpn Tunnel Outside Ip Address",
          description: "The external IP address of the VPN tunnel.",
          type: "string",
          required: true,
        },
        ApplyPendingMaintenance: {
          name: "Apply Pending Maintenance",
          description: "Trigger pending tunnel endpoint maintenance.",
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

        const command = new ReplaceVpnTunnelCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Replace Vpn Tunnel Result",
      description: "Result from ReplaceVpnTunnel operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Return: {
            type: "boolean",
            description: "Confirmation of replace tunnel operation.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default replaceVpnTunnel;
