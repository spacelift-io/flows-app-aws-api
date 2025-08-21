import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, ChangePasswordCommand } from "@aws-sdk/client-iam";

const changePassword: AppBlock = {
  name: "Change Password",
  description:
    "Changes the password of the IAM user who is calling this operation.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        OldPassword: {
          name: "Old Password",
          description: "The IAM user's current password.",
          type: "string",
          required: true,
        },
        NewPassword: {
          name: "New Password",
          description: "The new password.",
          type: "string",
          required: true,
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

        const command = new ChangePasswordCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Change Password Result",
      description: "Result from ChangePassword operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default changePassword;
