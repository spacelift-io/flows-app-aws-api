import { AppBlock, events } from "@slflows/sdk/v1";
import { WAFClient, GetPermissionPolicyCommand } from "@aws-sdk/client-waf";

const getPermissionPolicy: AppBlock = {
  name: "Get Permission Policy",
  description: "This is AWS WAF Classic documentation.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ResourceArn: {
          name: "Resource Arn",
          description:
            "The Amazon Resource Name (ARN) of the RuleGroup for which you want to get the policy.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new WAFClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new GetPermissionPolicyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Permission Policy Result",
      description: "Result from GetPermissionPolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Policy: {
            type: "string",
            description: "The IAM policy attached to the specified RuleGroup.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getPermissionPolicy;
