import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, MoveAddressToVpcCommand } from "@aws-sdk/client-ec2";

const moveAddressToVpc: AppBlock = {
  name: "Move Address To Vpc",
  description: "This action is deprecated.",
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
        PublicIp: {
          name: "Public Ip",
          description: "The Elastic IP address.",
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

        const command = new MoveAddressToVpcCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Move Address To Vpc Result",
      description: "Result from MoveAddressToVpc operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          AllocationId: {
            type: "string",
            description: "The allocation ID for the Elastic IP address.",
          },
          Status: {
            type: "string",
            description: "The status of the move of the IP address.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default moveAddressToVpc;
