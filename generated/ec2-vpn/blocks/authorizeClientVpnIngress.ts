import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  AuthorizeClientVpnIngressCommand,
} from "@aws-sdk/client-ec2";

const authorizeClientVpnIngress: AppBlock = {
  name: "Authorize Client Vpn Ingress",
  description: "Adds an ingress authorization rule to a Client VPN endpoint.",
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
          description: "The ID of the Client VPN endpoint.",
          type: "string",
          required: true,
        },
        TargetNetworkCidr: {
          name: "Target Network Cidr",
          description:
            "The IPv4 address range, in CIDR notation, of the network for which access is being authorized.",
          type: "string",
          required: true,
        },
        AccessGroupId: {
          name: "Access Group Id",
          description:
            "The ID of the group to grant access to, for example, the Active Directory group or identity provider (IdP) group.",
          type: "string",
          required: false,
        },
        AuthorizeAllGroups: {
          name: "Authorize All Groups",
          description: "Indicates whether to grant access to all clients.",
          type: "boolean",
          required: false,
        },
        Description: {
          name: "Description",
          description: "A brief description of the authorization rule.",
          type: "string",
          required: false,
        },
        ClientToken: {
          name: "Client Token",
          description:
            "Unique, case-sensitive identifier that you provide to ensure the idempotency of the request.",
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

        const command = new AuthorizeClientVpnIngressCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Authorize Client Vpn Ingress Result",
      description: "Result from AuthorizeClientVpnIngress operation",
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

export default authorizeClientVpnIngress;
