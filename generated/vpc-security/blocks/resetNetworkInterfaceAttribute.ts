import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  ResetNetworkInterfaceAttributeCommand,
} from "@aws-sdk/client-ec2";

const resetNetworkInterfaceAttribute: AppBlock = {
  name: "Reset Network Interface Attribute",
  description: "Resets a network interface attribute.",
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
        NetworkInterfaceId: {
          name: "Network Interface Id",
          description: "The ID of the network interface.",
          type: "string",
          required: true,
        },
        SourceDestCheck: {
          name: "Source Dest Check",
          description: "The source/destination checking attribute.",
          type: "string",
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

        const command = new ResetNetworkInterfaceAttributeCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Reset Network Interface Attribute Result",
      description: "Result from ResetNetworkInterfaceAttribute operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default resetNetworkInterfaceAttribute;
