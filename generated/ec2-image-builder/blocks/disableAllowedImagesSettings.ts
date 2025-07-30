import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DisableAllowedImagesSettingsCommand,
} from "@aws-sdk/client-ec2";

const disableAllowedImagesSettings: AppBlock = {
  name: "Disable Allowed Images Settings",
  description:
    "Disables Allowed AMIs for your account in the specified Amazon Web Services Region.",
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

        const command = new DisableAllowedImagesSettingsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Disable Allowed Images Settings Result",
      description: "Result from DisableAllowedImagesSettings operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          AllowedImagesSettingsState: {
            type: "string",
            description:
              "Returns disabled if the request succeeds; otherwise, it returns an error.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default disableAllowedImagesSettings;
