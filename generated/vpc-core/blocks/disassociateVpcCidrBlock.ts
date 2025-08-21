import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DisassociateVpcCidrBlockCommand,
} from "@aws-sdk/client-ec2";

const disassociateVpcCidrBlock: AppBlock = {
  name: "Disassociate Vpc Cidr Block",
  description: "Disassociates a CIDR block from a VPC.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        AssociationId: {
          name: "Association Id",
          description: "The association ID for the CIDR block.",
          type: "string",
          required: true,
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

        const command = new DisassociateVpcCidrBlockCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Disassociate Vpc Cidr Block Result",
      description: "Result from DisassociateVpcCidrBlock operation",
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
              NetworkBorderGroup: {
                type: "string",
              },
              Ipv6Pool: {
                type: "string",
              },
              Ipv6AddressAttribute: {
                type: "string",
              },
              IpSource: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "Information about the IPv6 CIDR block association.",
          },
          CidrBlockAssociation: {
            type: "object",
            properties: {
              AssociationId: {
                type: "string",
              },
              CidrBlock: {
                type: "string",
              },
              CidrBlockState: {
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
            },
            additionalProperties: false,
            description: "Information about the IPv4 CIDR block association.",
          },
          VpcId: {
            type: "string",
            description: "The ID of the VPC.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default disassociateVpcCidrBlock;
