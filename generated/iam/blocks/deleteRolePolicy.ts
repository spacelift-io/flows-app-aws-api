import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, DeleteRolePolicyCommand } from "@aws-sdk/client-iam";

const deleteRolePolicy: AppBlock = {
  name: "Delete Role Policy",
  description:
    "Deletes the specified inline policy that is embedded in the specified IAM role.",
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
            "The name (friendly name, not ARN) identifying the role that the policy is embedded in.",
          type: "string",
          required: true,
        },
        PolicyName: {
          name: "Policy Name",
          description:
            "The name of the inline policy to delete from the specified IAM role.",
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

        const command = new DeleteRolePolicyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Role Policy Result",
      description: "Result from DeleteRolePolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteRolePolicy;
