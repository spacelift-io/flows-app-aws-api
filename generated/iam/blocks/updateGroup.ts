import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, UpdateGroupCommand } from "@aws-sdk/client-iam";

const updateGroup: AppBlock = {
  name: "Update Group",
  description: "Updates the name and/or the path of the specified IAM group.",
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
          description: "Name of the IAM group to update.",
          type: "string",
          required: true,
        },
        NewPath: {
          name: "New Path",
          description: "New path for the IAM group.",
          type: "string",
          required: false,
        },
        NewGroupName: {
          name: "New Group Name",
          description: "New name for the IAM group.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new UpdateGroupCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Group Result",
      description: "Result from UpdateGroup operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default updateGroup;
