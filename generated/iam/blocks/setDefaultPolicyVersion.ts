import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, SetDefaultPolicyVersionCommand } from "@aws-sdk/client-iam";

const setDefaultPolicyVersion: AppBlock = {
  name: "Set Default Policy Version",
  description:
    "Sets the specified version of the specified policy as the policy's default (operative) version.",
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
            "The Amazon Resource Name (ARN) of the IAM policy whose default version you want to set.",
          type: "string",
          required: true,
        },
        VersionId: {
          name: "Version Id",
          description:
            "The version of the policy to set as the default (operative) version.",
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

        const command = new SetDefaultPolicyVersionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Set Default Policy Version Result",
      description: "Result from SetDefaultPolicyVersion operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default setDefaultPolicyVersion;
