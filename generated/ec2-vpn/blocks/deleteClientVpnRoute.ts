import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, DeleteClientVpnRouteCommand } from "@aws-sdk/client-ec2";

const deleteClientVpnRoute: AppBlock = {
  name: "Delete Client Vpn Route",
  description: "Deletes a route from a Client VPN endpoint.",
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
            "The ID of the Client VPN endpoint from which the route is to be deleted.",
          type: "string",
          required: true,
        },
        TargetVpcSubnetId: {
          name: "Target Vpc Subnet Id",
          description: "The ID of the target subnet used by the route.",
          type: "string",
          required: false,
        },
        DestinationCidrBlock: {
          name: "Destination Cidr Block",
          description:
            "The IPv4 address range, in CIDR notation, of the route to be deleted.",
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

        const command = new DeleteClientVpnRouteCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Client Vpn Route Result",
      description: "Result from DeleteClientVpnRoute operation",
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
            description: "The current state of the route.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteClientVpnRoute;
