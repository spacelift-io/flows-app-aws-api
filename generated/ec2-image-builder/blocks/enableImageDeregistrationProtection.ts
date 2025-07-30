import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  EnableImageDeregistrationProtectionCommand,
} from "@aws-sdk/client-ec2";

const enableImageDeregistrationProtection: AppBlock = {
  name: "Enable Image Deregistration Protection",
  description: "Enables deregistration protection for an AMI.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ImageId: {
          name: "Image Id",
          description: "The ID of the AMI.",
          type: "string",
          required: true,
        },
        WithCooldown: {
          name: "With Cooldown",
          description:
            "If true, enforces deregistration protection for 24 hours after deregistration protection is disabled.",
          type: "boolean",
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

        const command = new EnableImageDeregistrationProtectionCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Enable Image Deregistration Protection Result",
      description: "Result from EnableImageDeregistrationProtection operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Return: {
            type: "string",
            description:
              "Returns true if the request succeeds; otherwise, it returns an error.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default enableImageDeregistrationProtection;
