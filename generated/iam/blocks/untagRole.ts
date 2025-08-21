import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, UntagRoleCommand } from "@aws-sdk/client-iam";

const untagRole: AppBlock = {
  name: "Untag Role",
  description: "Removes the specified tags from the role.",
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
          description:
            "The name of the IAM role from which you want to remove tags.",
          type: "string",
          required: true,
        },
        TagKeys: {
          name: "Tag Keys",
          description: "A list of key names as a simple array of strings.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
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

        const command = new UntagRoleCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Untag Role Result",
      description: "Result from UntagRole operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default untagRole;
