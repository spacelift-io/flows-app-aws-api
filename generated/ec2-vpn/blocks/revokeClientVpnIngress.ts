import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, RevokeClientVpnIngressCommand } from "@aws-sdk/client-ec2";

const revokeClientVpnIngress: AppBlock = {
  name: "Revoke Client Vpn Ingress",
  description:
    "Removes an ingress authorization rule from a Client VPN endpoint.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ClientVpnEndpointId: {
          name: "Client Vpn Endpoint Id",
          description:
            "The ID of the Client VPN endpoint with which the authorization rule is associated.",
          type: "string",
          required: true,
        },
        TargetNetworkCidr: {
          name: "Target Network Cidr",
          description:
            "The IPv4 address range, in CIDR notation, of the network for which access is being removed.",
          type: "string",
          required: true,
        },
        AccessGroupId: {
          name: "Access Group Id",
          description:
            "The ID of the Active Directory group for which to revoke access.",
          type: "string",
          required: false,
        },
        RevokeAllGroups: {
          name: "Revoke All Groups",
          description:
            "Indicates whether access should be revoked for all groups for a single TargetNetworkCidr that earlier authorized ingress for all groups using AuthorizeAllGroups.",
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

        const command = new RevokeClientVpnIngressCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Revoke Client Vpn Ingress Result",
      description: "Result from RevokeClientVpnIngress operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Status: {
            type: "object",
            properties: {
              Code: {
                type: "string",
              },
              Message: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "The current state of the authorization rule.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default revokeClientVpnIngress;
