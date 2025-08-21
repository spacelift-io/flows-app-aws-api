import { AppBlock, events } from "@slflows/sdk/v1";
import { WAFClient, GetRateBasedRuleCommand } from "@aws-sdk/client-waf";

const getRateBasedRule: AppBlock = {
  name: "Get Rate Based Rule",
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
        RuleId: {
          name: "Rule Id",
          description: "The RuleId of the RateBasedRule that you want to get.",
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

        const command = new GetRateBasedRuleCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Rate Based Rule Result",
      description: "Result from GetRateBasedRule operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Rule: {
            type: "object",
            properties: {
              RuleId: {
                type: "string",
              },
              Name: {
                type: "string",
              },
              MetricName: {
                type: "string",
              },
              MatchPredicates: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Negated: {
                      type: "boolean",
                    },
                    Type: {
                      type: "string",
                    },
                    DataId: {
                      type: "string",
                    },
                  },
                  required: ["Negated", "Type", "DataId"],
                  additionalProperties: false,
                },
              },
              RateKey: {
                type: "string",
              },
              RateLimit: {
                type: "number",
              },
            },
            required: ["RuleId", "MatchPredicates", "RateKey", "RateLimit"],
            additionalProperties: false,
            description:
              "Information about the RateBasedRule that you specified in the GetRateBasedRule request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getRateBasedRule;
