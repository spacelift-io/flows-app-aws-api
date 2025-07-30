import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, DeleteVpnGatewayCommand } from "@aws-sdk/client-ec2";

const deleteVpnGateway: AppBlock = {
  name: "Delete Vpn Gateway",
  description: "Deletes the specified virtual private gateway.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
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
        });

        const command = new DeleteVpnGatewayCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Vpn Gateway Result",
      description: "Result from DeleteVpnGateway operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteVpnGateway;
