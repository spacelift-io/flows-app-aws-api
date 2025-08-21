import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, DeleteUserPolicyCommand } from "@aws-sdk/client-iam";

const deleteUserPolicy: AppBlock = {
  name: "Delete User Policy",
  description:
    "Deletes the specified inline policy that is embedded in the specified IAM user.",
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
            "The name (friendly name, not ARN) identifying the user that the policy is embedded in.",
          type: "string",
          required: true,
        },
        PolicyName: {
          name: "Policy Name",
          description: "The name identifying the policy document to delete.",
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

        const command = new DeleteUserPolicyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete User Policy Result",
      description: "Result from DeleteUserPolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteUserPolicy;
