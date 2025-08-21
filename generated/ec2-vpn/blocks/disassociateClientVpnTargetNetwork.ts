import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DisassociateClientVpnTargetNetworkCommand,
} from "@aws-sdk/client-ec2";

const disassociateClientVpnTargetNetwork: AppBlock = {
  name: "Disassociate Client Vpn Target Network",
  description:
    "Disassociates a target network from the specified Client VPN endpoint.",
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
            "The ID of the Client VPN endpoint from which to disassociate the target network.",
          type: "string",
          required: true,
        },
        AssociationId: {
          name: "Association Id",
          description: "The ID of the target network association.",
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

        const command = new DisassociateClientVpnTargetNetworkCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Disassociate Client Vpn Target Network Result",
      description: "Result from DisassociateClientVpnTargetNetwork operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          AssociationId: {
            type: "string",
            description: "The ID of the target network association.",
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

export default disassociateClientVpnTargetNetwork;
