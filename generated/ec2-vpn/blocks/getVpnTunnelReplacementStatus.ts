import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  GetVpnTunnelReplacementStatusCommand,
} from "@aws-sdk/client-ec2";

const getVpnTunnelReplacementStatus: AppBlock = {
  name: "Get Vpn Tunnel Replacement Status",
  description: "Get details of available tunnel endpoint maintenance.",
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

        const command = new GetVpnTunnelReplacementStatusCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Vpn Tunnel Replacement Status Result",
      description: "Result from GetVpnTunnelReplacementStatus operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          VpnConnectionId: {
            type: "string",
            description: "The ID of the Site-to-Site VPN connection.",
          },
          TransitGatewayId: {
            type: "string",
            description:
              "The ID of the transit gateway associated with the VPN connection.",
          },
          CustomerGatewayId: {
            type: "string",
            description: "The ID of the customer gateway.",
          },
          VpnGatewayId: {
            type: "string",
            description: "The ID of the virtual private gateway.",
          },
          VpnTunnelOutsideIpAddress: {
            type: "string",
            description: "The external IP address of the VPN tunnel.",
          },
          MaintenanceDetails: {
            type: "object",
            properties: {
              PendingMaintenance: {
                type: "string",
              },
              MaintenanceAutoAppliedAfter: {
                type: "string",
              },
              LastMaintenanceApplied: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "Get details of pending tunnel endpoint maintenance.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getVpnTunnelReplacementStatus;
