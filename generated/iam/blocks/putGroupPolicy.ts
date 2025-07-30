import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, PutGroupPolicyCommand } from "@aws-sdk/client-iam";

const putGroupPolicy: AppBlock = {
  name: "Put Group Policy",
  description:
    "Adds or updates an inline policy document that is embedded in the specified IAM group.",
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
          description: "The name of the group to associate the policy with.",
          type: "string",
          required: true,
        },
        PolicyName: {
          name: "Policy Name",
          description: "The name of the policy document.",
          type: "string",
          required: true,
        },
        PolicyDocument: {
          name: "Policy Document",
          description: "The policy document.",
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

        const command = new PutGroupPolicyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Group Policy Result",
      description: "Result from PutGroupPolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default putGroupPolicy;
