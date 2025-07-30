import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, UpdateAccessKeyCommand } from "@aws-sdk/client-iam";

const updateAccessKey: AppBlock = {
  name: "Update Access Key",
  description:
    "Changes the status of the specified access key from Active to Inactive, or vice versa.",
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
          description: "The name of the user whose key you want to update.",
          type: "string",
          required: false,
        },
        AccessKeyId: {
          name: "Access Key Id",
          description:
            "The access key ID of the secret access key you want to update.",
          type: "string",
          required: true,
        },
        Status: {
          name: "Status",
          description:
            "The status you want to assign to the secret access key.",
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

        const command = new UpdateAccessKeyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Access Key Result",
      description: "Result from UpdateAccessKey operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default updateAccessKey;
