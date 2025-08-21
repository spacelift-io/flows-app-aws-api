import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  AssociateNatGatewayAddressCommand,
} from "@aws-sdk/client-ec2";

const associateNatGatewayAddress: AppBlock = {
  name: "Associate Nat Gateway Address",
  description:
    "Associates Elastic IP addresses (EIPs) and private IPv4 addresses with a public NAT gateway.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        NatGatewayId: {
          name: "Nat Gateway Id",
          description: "The ID of the NAT gateway.",
          type: "string",
          required: true,
        },
        AllocationIds: {
          name: "Allocation Ids",
          description:
            "The allocation IDs of EIPs that you want to associate with your NAT gateway.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: true,
        },
        PrivateIpAddresses: {
          name: "Private Ip Addresses",
          description:
            "The private IPv4 addresses that you want to assign to the NAT gateway.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new AssociateNatGatewayAddressCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Associate Nat Gateway Address Result",
      description: "Result from AssociateNatGatewayAddress operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NatGatewayId: {
            type: "string",
            description: "The ID of the NAT gateway.",
          },
          NatGatewayAddresses: {
            type: "array",
            items: {
              type: "object",
              properties: {
                AllocationId: {
                  type: "string",
                },
                NetworkInterfaceId: {
                  type: "string",
                },
                PrivateIp: {
                  type: "string",
                },
                PublicIp: {
                  type: "string",
                },
                AssociationId: {
                  type: "string",
                },
                IsPrimary: {
                  type: "boolean",
                },
                FailureMessage: {
                  type: "string",
                },
                Status: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "The IP addresses.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default associateNatGatewayAddress;
