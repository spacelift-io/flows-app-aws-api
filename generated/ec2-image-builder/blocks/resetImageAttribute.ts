import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, ResetImageAttributeCommand } from "@aws-sdk/client-ec2";

const resetImageAttribute: AppBlock = {
  name: "Reset Image Attribute",
  description: "Resets an attribute of an AMI to its default value.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Attribute: {
          name: "Attribute",
          description:
            "The attribute to reset (currently you can only reset the launch permission attribute).",
          type: "string",
          required: true,
        },
        ImageId: {
          name: "Image Id",
          description: "The ID of the AMI.",
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

        const command = new ResetImageAttributeCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Reset Image Attribute Result",
      description: "Result from ResetImageAttribute operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default resetImageAttribute;
