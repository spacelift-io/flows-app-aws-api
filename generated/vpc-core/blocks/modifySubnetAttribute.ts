import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, ModifySubnetAttributeCommand } from "@aws-sdk/client-ec2";

const modifySubnetAttribute: AppBlock = {
  name: "Modify Subnet Attribute",
  description: "Modifies a subnet attribute.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        AssignIpv6AddressOnCreation: {
          name: "Assign Ipv6Address On Creation",
          description:
            "Specify true to indicate that network interfaces created in the specified subnet should be assigned an IPv6 address.",
          type: {
            type: "object",
            properties: {
              Value: {
                type: "boolean",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        MapPublicIpOnLaunch: {
          name: "Map Public Ip On Launch",
          description:
            "Specify true to indicate that network interfaces attached to instances created in the specified subnet should be assigned a public IPv4 address.",
          type: {
            type: "object",
            properties: {
              Value: {
                type: "boolean",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        SubnetId: {
          name: "Subnet Id",
          description: "The ID of the subnet.",
          type: "string",
          required: true,
        },
        MapCustomerOwnedIpOnLaunch: {
          name: "Map Customer Owned Ip On Launch",
          description:
            "Specify true to indicate that network interfaces attached to instances created in the specified subnet should be assigned a customer-owned IPv4 address.",
          type: {
            type: "object",
            properties: {
              Value: {
                type: "boolean",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        CustomerOwnedIpv4Pool: {
          name: "Customer Owned Ipv4Pool",
          description:
            "The customer-owned IPv4 address pool associated with the subnet.",
          type: "string",
          required: false,
        },
        EnableDns64: {
          name: "Enable Dns64",
          description:
            "Indicates whether DNS queries made to the Amazon-provided DNS Resolver in this subnet should return synthetic IPv6 addresses for IPv4-only destinations.",
          type: {
            type: "object",
            properties: {
              Value: {
                type: "boolean",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        PrivateDnsHostnameTypeOnLaunch: {
          name: "Private Dns Hostname Type On Launch",
          description:
            "The type of hostname to assign to instances in the subnet at launch.",
          type: "string",
          required: false,
        },
        EnableResourceNameDnsARecordOnLaunch: {
          name: "Enable Resource Name Dns A Record On Launch",
          description:
            "Indicates whether to respond to DNS queries for instance hostnames with DNS A records.",
          type: {
            type: "object",
            properties: {
              Value: {
                type: "boolean",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        EnableResourceNameDnsAAAARecordOnLaunch: {
          name: "Enable Resource Name Dns AAAA Record On Launch",
          description:
            "Indicates whether to respond to DNS queries for instance hostnames with DNS AAAA records.",
          type: {
            type: "object",
            properties: {
              Value: {
                type: "boolean",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        EnableLniAtDeviceIndex: {
          name: "Enable Lni At Device Index",
          description:
            "Indicates the device position for local network interfaces in this subnet.",
          type: "number",
          required: false,
        },
        DisableLniAtDeviceIndex: {
          name: "Disable Lni At Device Index",
          description:
            "Specify true to indicate that local network interfaces at the current position should be disabled.",
          type: {
            type: "object",
            properties: {
              Value: {
                type: "boolean",
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

        const command = new ModifySubnetAttributeCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Subnet Attribute Result",
      description: "Result from ModifySubnetAttribute operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default modifySubnetAttribute;
