import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, DeleteAccessKeyCommand } from "@aws-sdk/client-iam";

const deleteAccessKey: AppBlock = {
  name: "Delete Access Key",
  description:
    "Deletes the access key pair associated with the specified IAM user.",
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
            "The name of the user whose access key pair you want to delete.",
          type: "string",
          required: false,
        },
        AccessKeyId: {
          name: "Access Key Id",
          description:
            "The access key ID for the access key ID and secret access key you want to delete.",
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
        });

        const command = new DeleteAccessKeyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Access Key Result",
      description: "Result from DeleteAccessKey operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteAccessKey;
