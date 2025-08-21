import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, RemoveUserFromGroupCommand } from "@aws-sdk/client-iam";

const removeUserFromGroup: AppBlock = {
  name: "Remove User From Group",
  description: "Removes the specified user from the specified group.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        GroupName: {
          name: "Group Name",
          description: "The name of the group to update.",
          type: "string",
          required: true,
        },
        UserName: {
          name: "User Name",
          description: "The name of the user to remove.",
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

        const command = new RemoveUserFromGroupCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Remove User From Group Result",
      description: "Result from RemoveUserFromGroup operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default removeUserFromGroup;
