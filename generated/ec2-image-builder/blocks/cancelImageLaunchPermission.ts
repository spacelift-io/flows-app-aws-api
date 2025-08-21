import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  CancelImageLaunchPermissionCommand,
} from "@aws-sdk/client-ec2";

const cancelImageLaunchPermission: AppBlock = {
  name: "Cancel Image Launch Permission",
  description:
    "Removes your Amazon Web Services account from the launch permissions for the specified AMI.",
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
          description:
            "The ID of the AMI that was shared with your Amazon Web Services account.",
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

        const command = new CancelImageLaunchPermissionCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Cancel Image Launch Permission Result",
      description: "Result from CancelImageLaunchPermission operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Return: {
            type: "boolean",
            description:
              "Returns true if the request succeeds; otherwise, it returns an error.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default cancelImageLaunchPermission;
