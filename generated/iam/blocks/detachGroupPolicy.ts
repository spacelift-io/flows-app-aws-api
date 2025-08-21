import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, DetachGroupPolicyCommand } from "@aws-sdk/client-iam";

const detachGroupPolicy: AppBlock = {
  name: "Detach Group Policy",
  description:
    "Removes the specified managed policy from the specified IAM group.",
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
          description:
            "The name (friendly name, not ARN) of the IAM group to detach the policy from.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new DetachGroupPolicyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Detach Group Policy Result",
      description: "Result from DetachGroupPolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default detachGroupPolicy;
