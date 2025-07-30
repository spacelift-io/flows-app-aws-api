import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, UpdateAssumeRolePolicyCommand } from "@aws-sdk/client-iam";

const updateAssumeRolePolicy: AppBlock = {
  name: "Update Assume Role Policy",
  description:
    "Updates the policy that grants an IAM entity permission to assume a role.",
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
          description: "The name of the role to update with the new policy.",
          type: "string",
          required: true,
        },
        PolicyDocument: {
          name: "Policy Document",
          description:
            "The policy that grants an entity permission to assume the role.",
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

        const command = new UpdateAssumeRolePolicyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Assume Role Policy Result",
      description: "Result from UpdateAssumeRolePolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default updateAssumeRolePolicy;
