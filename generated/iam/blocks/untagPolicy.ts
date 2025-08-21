import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, UntagPolicyCommand } from "@aws-sdk/client-iam";

const untagPolicy: AppBlock = {
  name: "Untag Policy",
  description: "Removes the specified tags from the customer managed policy.",
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
            "The ARN of the IAM customer managed policy from which you want to remove tags.",
          type: "string",
          required: true,
        },
        TagKeys: {
          name: "Tag Keys",
          description: "A list of key names as a simple array of strings.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
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

        const command = new UntagPolicyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Untag Policy Result",
      description: "Result from UntagPolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default untagPolicy;
