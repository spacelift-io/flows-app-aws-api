import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, UpdateLoginProfileCommand } from "@aws-sdk/client-iam";

const updateLoginProfile: AppBlock = {
  name: "Update Login Profile",
  description: "Changes the password for the specified IAM user.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        UserName: {
          name: "User Name",
          description:
            "The name of the user whose password you want to update.",
          type: "string",
          required: true,
        },
        Password: {
          name: "Password",
          description: "The new password for the specified IAM user.",
          type: "string",
          required: false,
        },
        PasswordResetRequired: {
          name: "Password Reset Required",
          description:
            "Allows this new password to be used only once by requiring the specified IAM user to set a new password on next sign-in.",
          type: "boolean",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new IAMClient({
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

        const command = new UpdateLoginProfileCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Login Profile Result",
      description: "Result from UpdateLoginProfile operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default updateLoginProfile;
