import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  AssignPrivateNatGatewayAddressCommand,
} from "@aws-sdk/client-ec2";

const assignPrivateNatGatewayAddress: AppBlock = {
  name: "Assign Private Nat Gateway Address",
  description: "Assigns private IPv4 addresses to a private NAT gateway.",
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
        PrivateIpAddresses: {
          name: "Private Ip Addresses",
          description:
            "The private IPv4 addresses you want to assign to the private NAT gateway.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        PrivateIpAddressCount: {
          name: "Private Ip Address Count",
          description:
            "The number of private IP addresses to assign to the NAT gateway.",
          type: "number",
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

        const command = new AssignPrivateNatGatewayAddressCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Assign Private Nat Gateway Address Result",
      description: "Result from AssignPrivateNatGatewayAddress operation",
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
            description: "NAT gateway IP addresses.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default assignPrivateNatGatewayAddress;
