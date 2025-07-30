import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  UnassignPrivateIpAddressesCommand,
} from "@aws-sdk/client-ec2";

const unassignPrivateIpAddresses: AppBlock = {
  name: "Unassign Private Ip Addresses",
  description:
    "Unassigns the specified secondary private IP addresses or IPv4 Prefix Delegation prefixes from a network interface.",
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
            "The IPv4 prefixes to unassign from the network interface.",
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
        PrivateIpAddresses: {
          name: "Private Ip Addresses",
          description:
            "The secondary private IP addresses to unassign from the network interface.",
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
        });

        const command = new UnassignPrivateIpAddressesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Unassign Private Ip Addresses Result",
      description: "Result from UnassignPrivateIpAddresses operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default unassignPrivateIpAddresses;
