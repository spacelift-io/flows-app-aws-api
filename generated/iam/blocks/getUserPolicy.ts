import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, GetUserPolicyCommand } from "@aws-sdk/client-iam";

const getUserPolicy: AppBlock = {
  name: "Get User Policy",
  description:
    "Retrieves the specified inline policy document that is embedded in the specified IAM user.",
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
          description:
            "The name of the user who the policy is associated with.",
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

        const command = new GetUserPolicyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get User Policy Result",
      description: "Result from GetUserPolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          UserName: {
            type: "string",
            description: "The user the policy is associated with.",
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
        required: ["UserName", "PolicyName", "PolicyDocument"],
      },
    },
  },
};

export default getUserPolicy;
