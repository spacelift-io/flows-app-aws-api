import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, GetPolicyVersionCommand } from "@aws-sdk/client-iam";

const getPolicyVersion: AppBlock = {
  name: "Get Policy Version",
  description:
    "Retrieves information about the specified version of the specified managed policy, including the policy document.",
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
            "The Amazon Resource Name (ARN) of the managed policy that you want information about.",
          type: "string",
          required: true,
        },
        VersionId: {
          name: "Version Id",
          description: "Identifies the policy version to retrieve.",
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

        const command = new GetPolicyVersionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Policy Version Result",
      description: "Result from GetPolicyVersion operation",
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
              "A structure containing details about the policy version.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getPolicyVersion;
