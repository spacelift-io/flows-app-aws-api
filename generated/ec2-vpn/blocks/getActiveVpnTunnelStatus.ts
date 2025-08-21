import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  GetActiveVpnTunnelStatusCommand,
} from "@aws-sdk/client-ec2";

const getActiveVpnTunnelStatus: AppBlock = {
  name: "Get Active Vpn Tunnel Status",
  description:
    "Returns the currently negotiated security parameters for an active VPN tunnel, including IKE version, DH groups, encryption algorithms, and integrity algorithms.",
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
          description:
            "The ID of the VPN connection for which to retrieve the active tunnel status.",
          type: "string",
          required: true,
        },
        VpnTunnelOutsideIpAddress: {
          name: "Vpn Tunnel Outside Ip Address",
          description:
            "The external IP address of the VPN tunnel for which to retrieve the active status.",
          type: "string",
          required: true,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the action, without actually making the request.",
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

        const command = new GetActiveVpnTunnelStatusCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Active Vpn Tunnel Status Result",
      description: "Result from GetActiveVpnTunnelStatus operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ActiveVpnTunnelStatus: {
            type: "object",
            properties: {
              Phase1EncryptionAlgorithm: {
                type: "string",
              },
              Phase2EncryptionAlgorithm: {
                type: "string",
              },
              Phase1IntegrityAlgorithm: {
                type: "string",
              },
              Phase2IntegrityAlgorithm: {
                type: "string",
              },
              Phase1DHGroup: {
                type: "number",
              },
              Phase2DHGroup: {
                type: "number",
              },
              IkeVersion: {
                type: "string",
              },
              ProvisioningStatus: {
                type: "string",
              },
              ProvisioningStatusReason: {
                type: "string",
              },
            },
            additionalProperties: false,
            description:
              "Information about the current security configuration of the VPN tunnel.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getActiveVpnTunnelStatus;
