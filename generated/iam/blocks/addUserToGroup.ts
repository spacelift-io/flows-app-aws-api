import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, AddUserToGroupCommand } from "@aws-sdk/client-iam";

const addUserToGroup: AppBlock = {
  name: "Add User To Group",
  description: "Adds the specified user to the specified group.",
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
          description: "The name of the user to add.",
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

        const command = new AddUserToGroupCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Add User To Group Result",
      description: "Result from AddUserToGroup operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default addUserToGroup;
