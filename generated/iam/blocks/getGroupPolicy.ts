import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, GetGroupPolicyCommand } from "@aws-sdk/client-iam";

const getGroupPolicy: AppBlock = {
  name: "Get Group Policy",
  description:
    "Retrieves the specified inline policy document that is embedded in the specified IAM group.",
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
          description: "The name of the group the policy is associated with.",
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
        });

        const command = new GetGroupPolicyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Group Policy Result",
      description: "Result from GetGroupPolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          GroupName: {
            type: "string",
            description: "The group the policy is associated with.",
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
        required: ["GroupName", "PolicyName", "PolicyDocument"],
      },
    },
  },
};

export default getGroupPolicy;
