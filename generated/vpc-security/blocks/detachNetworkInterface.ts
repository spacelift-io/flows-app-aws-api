import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, DetachNetworkInterfaceCommand } from "@aws-sdk/client-ec2";

const detachNetworkInterface: AppBlock = {
  name: "Detach Network Interface",
  description: "Detaches a network interface from an instance.",
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
        AttachmentId: {
          name: "Attachment Id",
          description: "The ID of the attachment.",
          type: "string",
          required: true,
        },
        Force: {
          name: "Force",
          description: "Specifies whether to force a detachment.",
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

        const command = new DetachNetworkInterfaceCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Detach Network Interface Result",
      description: "Result from DetachNetworkInterface operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default detachNetworkInterface;
