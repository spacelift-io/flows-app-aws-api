import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, CreatePolicyVersionCommand } from "@aws-sdk/client-iam";

const createPolicyVersion: AppBlock = {
  name: "Create Policy Version",
  description: "Creates a new version of the specified managed policy.",
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
            "The Amazon Resource Name (ARN) of the IAM policy to which you want to add a new version.",
          type: "string",
          required: true,
        },
        PolicyDocument: {
          name: "Policy Document",
          description:
            "The JSON policy document that you want to use as the content for this new version of the policy.",
          type: "string",
          required: true,
        },
        SetAsDefault: {
          name: "Set As Default",
          description:
            "Specifies whether to set this version as the policy's default version.",
          type: "boolean",
          required: false,
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

        const command = new CreatePolicyVersionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Policy Version Result",
      description: "Result from CreatePolicyVersion operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          PolicyVersion: {
            type: "object",
            properties: {
              Document: {
                type: "string",
              },
              VersionId: {
                type: "string",
              },
              IsDefaultVersion: {
                type: "boolean",
              },
              CreateDate: {
                type: "string",
              },
            },
            additionalProperties: false,
            description:
              "A structure containing details about the new policy version.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createPolicyVersion;
