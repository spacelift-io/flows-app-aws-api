import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  EnableAllowedImagesSettingsCommand,
} from "@aws-sdk/client-ec2";

const enableAllowedImagesSettings: AppBlock = {
  name: "Enable Allowed Images Settings",
  description:
    "Enables Allowed AMIs for your account in the specified Amazon Web Services Region.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        AllowedImagesSettingsState: {
          name: "Allowed Images Settings State",
          description:
            "Specify enabled to apply the image criteria specified by the Allowed AMIs settings.",
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

        const command = new EnableAllowedImagesSettingsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Enable Allowed Images Settings Result",
      description: "Result from EnableAllowedImagesSettings operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          AllowedImagesSettingsState: {
            type: "string",
            description:
              "Returns enabled or audit-mode if the request succeeds; otherwise, it returns an error.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default enableAllowedImagesSettings;
