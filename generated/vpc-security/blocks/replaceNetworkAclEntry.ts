import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, ReplaceNetworkAclEntryCommand } from "@aws-sdk/client-ec2";

const replaceNetworkAclEntry: AppBlock = {
  name: "Replace Network Acl Entry",
  description: "Replaces an entry (rule) in a network ACL.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
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
        NetworkAclId: {
          name: "Network Acl Id",
          description: "The ID of the ACL.",
          type: "string",
          required: true,
        },
        RuleNumber: {
          name: "Rule Number",
          description: "The rule number of the entry to replace.",
          type: "number",
          required: true,
        },
        Protocol: {
          name: "Protocol",
          description: "The protocol number.",
          type: "string",
          required: true,
        },
        RuleAction: {
          name: "Rule Action",
          description:
            "Indicates whether to allow or deny the traffic that matches the rule.",
          type: "string",
          required: true,
        },
        Egress: {
          name: "Egress",
          description: "Indicates whether to replace the egress rule.",
          type: "boolean",
          required: true,
        },
        CidrBlock: {
          name: "Cidr Block",
          description:
            "The IPv4 network range to allow or deny, in CIDR notation (for example 172.",
          type: "string",
          required: false,
        },
        Ipv6CidrBlock: {
          name: "Ipv6Cidr Block",
          description:
            "The IPv6 network range to allow or deny, in CIDR notation (for example 2001:bd8:1234:1a00::/64).",
          type: "string",
          required: false,
        },
        IcmpTypeCode: {
          name: "Icmp Type Code",
          description: "ICMP protocol: The ICMP or ICMPv6 type and code.",
          type: {
            type: "object",
            properties: {
              Code: {
                type: "number",
              },
              Type: {
                type: "number",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        PortRange: {
          name: "Port Range",
          description:
            "TCP or UDP protocols: The range of ports the rule applies to.",
          type: {
            type: "object",
            properties: {
              From: {
                type: "number",
              },
              To: {
                type: "number",
              },
            },
            additionalProperties: false,
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

        const command = new ReplaceNetworkAclEntryCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Replace Network Acl Entry Result",
      description: "Result from ReplaceNetworkAclEntry operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default replaceNetworkAclEntry;
