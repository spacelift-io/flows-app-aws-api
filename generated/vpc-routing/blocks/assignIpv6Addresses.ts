import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, AssignIpv6AddressesCommand } from "@aws-sdk/client-ec2";

const assignIpv6Addresses: AppBlock = {
  name: "Assign Ipv6Addresses",
  description:
    "Assigns the specified IPv6 addresses to the specified network interface.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Ipv6PrefixCount: {
          name: "Ipv6Prefix Count",
          description:
            "The number of IPv6 prefixes that Amazon Web Services automatically assigns to the network interface.",
          type: "number",
          required: false,
        },
        Ipv6Prefixes: {
          name: "Ipv6Prefixes",
          description:
            "One or more IPv6 prefixes assigned to the network interface.",
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
            "The IPv6 addresses to be assigned to the network interface.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        Ipv6AddressCount: {
          name: "Ipv6Address Count",
          description:
            "The number of additional IPv6 addresses to assign to the network interface.",
          type: "number",
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

        const command = new AssignIpv6AddressesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Assign Ipv6Addresses Result",
      description: "Result from AssignIpv6Addresses operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          AssignedIpv6Addresses: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "The new IPv6 addresses assigned to the network interface.",
          },
          AssignedIpv6Prefixes: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "The IPv6 prefixes that are assigned to the network interface.",
          },
          NetworkInterfaceId: {
            type: "string",
            description: "The ID of the network interface.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default assignIpv6Addresses;
