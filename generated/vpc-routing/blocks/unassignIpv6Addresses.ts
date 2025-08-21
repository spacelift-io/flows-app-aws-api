import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, UnassignIpv6AddressesCommand } from "@aws-sdk/client-ec2";

const unassignIpv6Addresses: AppBlock = {
  name: "Unassign Ipv6Addresses",
  description:
    "Unassigns the specified IPv6 addresses or Prefix Delegation prefixes from a network interface.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Ipv6Prefixes: {
          name: "Ipv6Prefixes",
          description:
            "The IPv6 prefixes to unassign from the network interface.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        NetworkInterfaceId: {
          name: "Network Interface Id",
          description: "The ID of the network interface.",
          type: "string",
          required: true,
        },
        Ipv6Addresses: {
          name: "Ipv6Addresses",
          description:
            "The IPv6 addresses to unassign from the network interface.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
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

        const command = new UnassignIpv6AddressesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Unassign Ipv6Addresses Result",
      description: "Result from UnassignIpv6Addresses operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NetworkInterfaceId: {
            type: "string",
            description: "The ID of the network interface.",
          },
          UnassignedIpv6Addresses: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "The IPv6 addresses that have been unassigned from the network interface.",
          },
          UnassignedIpv6Prefixes: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "The IPv6 prefixes that have been unassigned from the network interface.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default unassignIpv6Addresses;
