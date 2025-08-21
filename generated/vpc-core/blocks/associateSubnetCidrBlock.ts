import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  AssociateSubnetCidrBlockCommand,
} from "@aws-sdk/client-ec2";

const associateSubnetCidrBlock: AppBlock = {
  name: "Associate Subnet Cidr Block",
  description: "Associates a CIDR block with your subnet.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Ipv6IpamPoolId: {
          name: "Ipv6Ipam Pool Id",
          description: "An IPv6 IPAM pool ID.",
          type: "string",
          required: false,
        },
        Ipv6NetmaskLength: {
          name: "Ipv6Netmask Length",
          description: "An IPv6 netmask length.",
          type: "number",
          required: false,
        },
        SubnetId: {
          name: "Subnet Id",
          description: "The ID of your subnet.",
          type: "string",
          required: true,
        },
        Ipv6CidrBlock: {
          name: "Ipv6Cidr Block",
          description: "The IPv6 CIDR block for your subnet.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new AssociateSubnetCidrBlockCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Associate Subnet Cidr Block Result",
      description: "Result from AssociateSubnetCidrBlock operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Ipv6CidrBlockAssociation: {
            type: "object",
            properties: {
              AssociationId: {
                type: "string",
              },
              Ipv6CidrBlock: {
                type: "string",
              },
              Ipv6CidrBlockState: {
                type: "object",
                properties: {
                  State: {
                    type: "string",
                  },
                  StatusMessage: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              Ipv6AddressAttribute: {
                type: "string",
              },
              IpSource: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "Information about the IPv6 association.",
          },
          SubnetId: {
            type: "string",
            description: "The ID of the subnet.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default associateSubnetCidrBlock;
