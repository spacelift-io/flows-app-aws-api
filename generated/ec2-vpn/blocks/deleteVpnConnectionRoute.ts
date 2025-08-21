import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DeleteVpnConnectionRouteCommand,
} from "@aws-sdk/client-ec2";

const deleteVpnConnectionRoute: AppBlock = {
  name: "Delete Vpn Connection Route",
  description:
    "Deletes the specified static route associated with a VPN connection between an existing virtual private gateway and a VPN customer gateway.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DestinationCidrBlock: {
          name: "Destination Cidr Block",
          description:
            "The CIDR block associated with the local subnet of the customer network.",
          type: "string",
          required: true,
        },
        VpnConnectionId: {
          name: "Vpn Connection Id",
          description: "The ID of the VPN connection.",
          type: "string",
          required: true,
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

        const command = new DeleteVpnConnectionRouteCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Vpn Connection Route Result",
      description: "Result from DeleteVpnConnectionRoute operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteVpnConnectionRoute;
