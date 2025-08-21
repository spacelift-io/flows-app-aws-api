import { AppBlock, events } from "@slflows/sdk/v1";
import { WAFClient, GetRuleGroupCommand } from "@aws-sdk/client-waf";

const getRuleGroup: AppBlock = {
  name: "Get Rule Group",
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
        RuleGroupId: {
          name: "Rule Group Id",
          description: "The RuleGroupId of the RuleGroup that you want to get.",
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

        const command = new GetRuleGroupCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Rule Group Result",
      description: "Result from GetRuleGroup operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          RuleGroup: {
            type: "object",
            properties: {
              RuleGroupId: {
                type: "string",
              },
              Name: {
                type: "string",
              },
              MetricName: {
                type: "string",
              },
            },
            required: ["RuleGroupId"],
            additionalProperties: false,
            description:
              "Information about the RuleGroup that you specified in the GetRuleGroup request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getRuleGroup;
