import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, DeleteLoginProfileCommand } from "@aws-sdk/client-iam";

const deleteLoginProfile: AppBlock = {
  name: "Delete Login Profile",
  description:
    "Deletes the password for the specified IAM user or root user, For more information, see Managing passwords for IAM users.",
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
            "The name of the user whose password you want to delete.",
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

        const command = new DeleteLoginProfileCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Login Profile Result",
      description: "Result from DeleteLoginProfile operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteLoginProfile;
