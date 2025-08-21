import { AppBlock, events } from "@slflows/sdk/v1";
import { WAFClient, PutPermissionPolicyCommand } from "@aws-sdk/client-waf";

const putPermissionPolicy: AppBlock = {
  name: "Put Permission Policy",
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
            "The Amazon Resource Name (ARN) of the RuleGroup to which you want to attach the policy.",
          type: "string",
          required: true,
        },
        Policy: {
          name: "Policy",
          description: "The policy to attach to the specified RuleGroup.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new PutPermissionPolicyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Permission Policy Result",
      description: "Result from PutPermissionPolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default putPermissionPolicy;
