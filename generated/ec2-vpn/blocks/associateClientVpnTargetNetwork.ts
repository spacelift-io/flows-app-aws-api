import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  AssociateClientVpnTargetNetworkCommand,
} from "@aws-sdk/client-ec2";

const associateClientVpnTargetNetwork: AppBlock = {
  name: "Associate Client Vpn Target Network",
  description: "Associates a target network with a Client VPN endpoint.",
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
        SubnetId: {
          name: "Subnet Id",
          description:
            "The ID of the subnet to associate with the Client VPN endpoint.",
          type: "string",
          required: true,
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
        });

        const command = new AssociateClientVpnTargetNetworkCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Associate Client Vpn Target Network Result",
      description: "Result from AssociateClientVpnTargetNetwork operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          AssociationId: {
            type: "string",
            description: "The unique ID of the target network association.",
          },
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
            description: "The current state of the target network association.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default associateClientVpnTargetNetwork;
