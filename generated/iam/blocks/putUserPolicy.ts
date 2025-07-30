import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, PutUserPolicyCommand } from "@aws-sdk/client-iam";

const putUserPolicy: AppBlock = {
  name: "Put User Policy",
  description:
    "Adds or updates an inline policy document that is embedded in the specified IAM user.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        UserName: {
          name: "User Name",
          description: "The name of the user to associate the policy with.",
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

        const command = new PutUserPolicyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put User Policy Result",
      description: "Result from PutUserPolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default putUserPolicy;
