import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, AttachVpnGatewayCommand } from "@aws-sdk/client-ec2";

const attachVpnGateway: AppBlock = {
  name: "Attach Vpn Gateway",
  description: "Attaches an available virtual private gateway to a VPC.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        VpcId: {
          name: "Vpc Id",
          description: "The ID of the VPC.",
          type: "string",
          required: true,
        },
        VpnGatewayId: {
          name: "Vpn Gateway Id",
          description: "The ID of the virtual private gateway.",
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

        const command = new AttachVpnGatewayCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Attach Vpn Gateway Result",
      description: "Result from AttachVpnGateway operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          VpcAttachment: {
            type: "object",
            properties: {
              VpcId: {
                type: "string",
              },
              State: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "Information about the attachment.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default attachVpnGateway;
