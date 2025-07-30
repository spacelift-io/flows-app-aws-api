import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, DetachUserPolicyCommand } from "@aws-sdk/client-iam";

const detachUserPolicy: AppBlock = {
  name: "Detach User Policy",
  description: "Removes the specified managed policy from the specified user.",
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
            "The name (friendly name, not ARN) of the IAM user to detach the policy from.",
          type: "string",
          required: true,
        },
        PolicyArn: {
          name: "Policy Arn",
          description:
            "The Amazon Resource Name (ARN) of the IAM policy you want to detach.",
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

        const command = new DetachUserPolicyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Detach User Policy Result",
      description: "Result from DetachUserPolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default detachUserPolicy;
