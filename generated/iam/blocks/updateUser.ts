import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, UpdateUserCommand } from "@aws-sdk/client-iam";

const updateUser: AppBlock = {
  name: "Update User",
  description: "Updates the name and/or the path of the specified IAM user.",
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
          description: "Name of the user to update.",
          type: "string",
          required: true,
        },
        NewPath: {
          name: "New Path",
          description: "New path for the IAM user.",
          type: "string",
          required: false,
        },
        NewUserName: {
          name: "New User Name",
          description: "New name for the user.",
          type: "string",
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
        });

        const command = new UpdateUserCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update User Result",
      description: "Result from UpdateUser operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default updateUser;
