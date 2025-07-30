import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, DeleteNatGatewayCommand } from "@aws-sdk/client-ec2";

const deleteNatGateway: AppBlock = {
  name: "Delete Nat Gateway",
  description: "Deletes the specified NAT gateway.",
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
        NatGatewayId: {
          name: "Nat Gateway Id",
          description: "The ID of the NAT gateway.",
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
        });

        const command = new DeleteNatGatewayCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Nat Gateway Result",
      description: "Result from DeleteNatGateway operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NatGatewayId: {
            type: "string",
            description: "The ID of the NAT gateway.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteNatGateway;
