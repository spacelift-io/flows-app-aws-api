import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, DeletePolicyVersionCommand } from "@aws-sdk/client-iam";

const deletePolicyVersion: AppBlock = {
  name: "Delete Policy Version",
  description:
    "Deletes the specified version from the specified managed policy.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        PolicyArn: {
          name: "Policy Arn",
          description:
            "The Amazon Resource Name (ARN) of the IAM policy from which you want to delete a version.",
          type: "string",
          required: true,
        },
        VersionId: {
          name: "Version Id",
          description: "The policy version to delete.",
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

        const command = new DeletePolicyVersionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Policy Version Result",
      description: "Result from DeletePolicyVersion operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deletePolicyVersion;
