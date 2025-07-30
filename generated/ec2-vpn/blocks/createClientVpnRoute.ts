import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, CreateClientVpnRouteCommand } from "@aws-sdk/client-ec2";

const createClientVpnRoute: AppBlock = {
  name: "Create Client Vpn Route",
  description: "Adds a route to a network to a Client VPN endpoint.",
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
            "The ID of the Client VPN endpoint to which to add the route.",
          type: "string",
          required: true,
        },
        DestinationCidrBlock: {
          name: "Destination Cidr Block",
          description:
            "The IPv4 address range, in CIDR notation, of the route destination.",
          type: "string",
          required: true,
        },
        TargetVpcSubnetId: {
          name: "Target Vpc Subnet Id",
          description:
            "The ID of the subnet through which you want to route traffic.",
          type: "string",
          required: true,
        },
        Description: {
          name: "Description",
          description: "A brief description of the route.",
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
        });

        const command = new CreateClientVpnRouteCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Client Vpn Route Result",
      description: "Result from CreateClientVpnRoute operation",
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

export default createClientVpnRoute;
