import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, GetRolePolicyCommand } from "@aws-sdk/client-iam";

const getRolePolicy: AppBlock = {
  name: "Get Role Policy",
  description:
    "Retrieves the specified inline policy document that is embedded with the specified IAM role.",
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
          description: "The name of the role associated with the policy.",
          type: "string",
          required: true,
        },
        PolicyName: {
          name: "Policy Name",
          description: "The name of the policy document to get.",
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

        const command = new GetRolePolicyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Role Policy Result",
      description: "Result from GetRolePolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          RoleName: {
            type: "string",
            description: "The role the policy is associated with.",
          },
          PolicyName: {
            type: "string",
            description: "The name of the policy.",
          },
          PolicyDocument: {
            type: "string",
            description: "The policy document.",
          },
        },
        required: ["RoleName", "PolicyName", "PolicyDocument"],
      },
    },
  },
};

export default getRolePolicy;
