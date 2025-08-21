import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  AssignPrivateIpAddressesCommand,
} from "@aws-sdk/client-ec2";

const assignPrivateIpAddresses: AppBlock = {
  name: "Assign Private Ip Addresses",
  description:
    "Assigns the specified secondary private IP addresses to the specified network interface.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Ipv4Prefixes: {
          name: "Ipv4Prefixes",
          description:
            "One or more IPv4 prefixes assigned to the network interface.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        Ipv4PrefixCount: {
          name: "Ipv4Prefix Count",
          description:
            "The number of IPv4 prefixes that Amazon Web Services automatically assigns to the network interface.",
          type: "number",
          required: false,
        },
        NetworkInterfaceId: {
          name: "Network Interface Id",
          description: "The ID of the network interface.",
          type: "string",
          required: true,
        },
        PrivateIpAddresses: {
          name: "Private Ip Addresses",
          description:
            "The IP addresses to be assigned as a secondary private IP address to the network interface.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        SecondaryPrivateIpAddressCount: {
          name: "Secondary Private Ip Address Count",
          description:
            "The number of secondary IP addresses to assign to the network interface.",
          type: "number",
          required: false,
        },
        AllowReassignment: {
          name: "Allow Reassignment",
          description:
            "Indicates whether to allow an IP address that is already assigned to another network interface or instance to be reassigned to the specified network interface.",
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

        const command = new AssignPrivateIpAddressesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Assign Private Ip Addresses Result",
      description: "Result from AssignPrivateIpAddresses operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NetworkInterfaceId: {
            type: "string",
            description: "The ID of the network interface.",
          },
          AssignedPrivateIpAddresses: {
            type: "array",
            items: {
              type: "object",
              properties: {
                PrivateIpAddress: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "The private IP addresses assigned to the network interface.",
          },
          AssignedIpv4Prefixes: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Ipv4Prefix: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "The IPv4 prefixes that are assigned to the network interface.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default assignPrivateIpAddresses;
