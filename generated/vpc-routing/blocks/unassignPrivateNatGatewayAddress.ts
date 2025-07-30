import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  UnassignPrivateNatGatewayAddressCommand,
} from "@aws-sdk/client-ec2";

const unassignPrivateNatGatewayAddress: AppBlock = {
  name: "Unassign Private Nat Gateway Address",
  description:
    "Unassigns secondary private IPv4 addresses from a private NAT gateway.",
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
          description: "The private IPv4 addresses you want to unassign.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: true,
        },
        MaxDrainDurationSeconds: {
          name: "Max Drain Duration Seconds",
          description:
            "The maximum amount of time to wait (in seconds) before forcibly releasing the IP addresses if connections are still in progress.",
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
        });

        const command = new UnassignPrivateNatGatewayAddressCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Unassign Private Nat Gateway Address Result",
      description: "Result from UnassignPrivateNatGatewayAddress operation",
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
            description: "Information about the NAT gateway IP addresses.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default unassignPrivateNatGatewayAddress;
