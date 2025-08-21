import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, CreateGroupCommand } from "@aws-sdk/client-iam";

const createGroup: AppBlock = {
  name: "Create Group",
  description: "Creates a new group.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Path: {
          name: "Path",
          description: "The path to the group.",
          type: "string",
          required: false,
        },
        GroupName: {
          name: "Group Name",
          description: "The name of the group to create.",
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

        const command = new CreateGroupCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Group Result",
      description: "Result from CreateGroup operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Group: {
            type: "object",
            properties: {
              Path: {
                type: "string",
              },
              GroupName: {
                type: "string",
              },
              GroupId: {
                type: "string",
              },
              Arn: {
                type: "string",
              },
              CreateDate: {
                type: "string",
              },
            },
            required: ["Path", "GroupName", "GroupId", "Arn", "CreateDate"],
            additionalProperties: false,
            description: "A structure containing details about the new group.",
          },
        },
        required: ["Group"],
      },
    },
  },
};

export default createGroup;
