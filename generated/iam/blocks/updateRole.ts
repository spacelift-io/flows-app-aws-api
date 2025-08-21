import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, UpdateRoleCommand } from "@aws-sdk/client-iam";

const updateRole: AppBlock = {
  name: "Update Role",
  description:
    "Updates the description or maximum session duration setting of a role.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        RoleName: {
          name: "Role Name",
          description: "The name of the role that you want to modify.",
          type: "string",
          required: true,
        },
        Description: {
          name: "Description",
          description:
            "The new description that you want to apply to the specified role.",
          type: "string",
          required: false,
        },
        MaxSessionDuration: {
          name: "Max Session Duration",
          description:
            "The maximum session duration (in seconds) that you want to set for the specified role.",
          type: "number",
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

        const command = new UpdateRoleCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Role Result",
      description: "Result from UpdateRole operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default updateRole;
