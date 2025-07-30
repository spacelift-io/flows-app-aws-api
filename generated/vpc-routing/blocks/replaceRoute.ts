import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, ReplaceRouteCommand } from "@aws-sdk/client-ec2";

const replaceRoute: AppBlock = {
  name: "Replace Route",
  description: "Replaces an existing route within a route table in a VPC.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DestinationPrefixListId: {
          name: "Destination Prefix List Id",
          description: "The ID of the prefix list for the route.",
          type: "string",
          required: false,
        },
        VpcEndpointId: {
          name: "Vpc Endpoint Id",
          description: "The ID of a VPC endpoint.",
          type: "string",
          required: false,
        },
        LocalTarget: {
          name: "Local Target",
          description:
            "Specifies whether to reset the local route to its default target (local).",
          type: "boolean",
          required: false,
        },
        TransitGatewayId: {
          name: "Transit Gateway Id",
          description: "The ID of a transit gateway.",
          type: "string",
          required: false,
        },
        LocalGatewayId: {
          name: "Local Gateway Id",
          description: "The ID of the local gateway.",
          type: "string",
          required: false,
        },
        CarrierGatewayId: {
          name: "Carrier Gateway Id",
          description: "[IPv4 traffic only] The ID of a carrier gateway.",
          type: "string",
          required: false,
        },
        CoreNetworkArn: {
          name: "Core Network Arn",
          description: "The Amazon Resource Name (ARN) of the core network.",
          type: "string",
          required: false,
        },
        OdbNetworkArn: {
          name: "Odb Network Arn",
          description: "The Amazon Resource Name (ARN) of the ODB network.",
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
        RouteTableId: {
          name: "Route Table Id",
          description: "The ID of the route table.",
          type: "string",
          required: true,
        },
        DestinationCidrBlock: {
          name: "Destination Cidr Block",
          description:
            "The IPv4 CIDR address block used for the destination match.",
          type: "string",
          required: false,
        },
        GatewayId: {
          name: "Gateway Id",
          description:
            "The ID of an internet gateway or virtual private gateway.",
          type: "string",
          required: false,
        },
        DestinationIpv6CidrBlock: {
          name: "Destination Ipv6Cidr Block",
          description:
            "The IPv6 CIDR address block used for the destination match.",
          type: "string",
          required: false,
        },
        EgressOnlyInternetGatewayId: {
          name: "Egress Only Internet Gateway Id",
          description:
            "[IPv6 traffic only] The ID of an egress-only internet gateway.",
          type: "string",
          required: false,
        },
        InstanceId: {
          name: "Instance Id",
          description: "The ID of a NAT instance in your VPC.",
          type: "string",
          required: false,
        },
        NetworkInterfaceId: {
          name: "Network Interface Id",
          description: "The ID of a network interface.",
          type: "string",
          required: false,
        },
        VpcPeeringConnectionId: {
          name: "Vpc Peering Connection Id",
          description: "The ID of a VPC peering connection.",
          type: "string",
          required: false,
        },
        NatGatewayId: {
          name: "Nat Gateway Id",
          description: "[IPv4 traffic only] The ID of a NAT gateway.",
          type: "string",
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

        const command = new ReplaceRouteCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Replace Route Result",
      description: "Result from ReplaceRoute operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default replaceRoute;
