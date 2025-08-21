import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  ApplySecurityGroupsToClientVpnTargetNetworkCommand,
} from "@aws-sdk/client-ec2";

const applySecurityGroupsToClientVpnTargetNetwork: AppBlock = {
  name: "Apply Security Groups To Client Vpn Target Network",
  description:
    "Applies a security group to the association between the target network and the Client VPN endpoint.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ClientVpnEndpointId: {
          name: "Client Vpn Endpoint Id",
          description: "The ID of the Client VPN endpoint.",
          type: "string",
          required: true,
        },
        VpcId: {
          name: "Vpc Id",
          description:
            "The ID of the VPC in which the associated target network is located.",
          type: "string",
          required: true,
        },
        SecurityGroupIds: {
          name: "Security Group Ids",
          description:
            "The IDs of the security groups to apply to the associated target network.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: true,
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

        const command = new ApplySecurityGroupsToClientVpnTargetNetworkCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Apply Security Groups To Client Vpn Target Network Result",
      description:
        "Result from ApplySecurityGroupsToClientVpnTargetNetwork operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          SecurityGroupIds: {
            type: "array",
            items: {
              type: "string",
            },
            description: "The IDs of the applied security groups.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default applySecurityGroupsToClientVpnTargetNetwork;
