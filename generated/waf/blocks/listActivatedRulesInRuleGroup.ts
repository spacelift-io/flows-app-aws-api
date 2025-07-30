import { AppBlock, events } from "@slflows/sdk/v1";
import {
  WAFClient,
  ListActivatedRulesInRuleGroupCommand,
} from "@aws-sdk/client-waf";

const listActivatedRulesInRuleGroup: AppBlock = {
  name: "List Activated Rules In Rule Group",
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
          description:
            "The RuleGroupId of the RuleGroup for which you want to get a list of ActivatedRule objects.",
          type: "string",
          required: false,
        },
        NextMarker: {
          name: "Next Marker",
          description:
            "If you specify a value for Limit and you have more ActivatedRules than the value of Limit, AWS WAF returns a NextMarker value in the response that allows you to list another group of ActivatedRules.",
          type: "string",
          required: false,
        },
        Limit: {
          name: "Limit",
          description:
            "Specifies the number of ActivatedRules that you want AWS WAF to return for this request.",
          type: "number",
          required: false,
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

        const command = new ListActivatedRulesInRuleGroupCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Activated Rules In Rule Group Result",
      description: "Result from ListActivatedRulesInRuleGroup operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NextMarker: {
            type: "string",
            description:
              "If you have more ActivatedRules than the number that you specified for Limit in the request, the response includes a NextMarker value.",
          },
          ActivatedRules: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Priority: {
                  type: "number",
                },
                RuleId: {
                  type: "string",
                },
                Action: {
                  type: "object",
                  properties: {
                    Type: {
                      type: "string",
                    },
                  },
                  required: ["Type"],
                  additionalProperties: false,
                },
                OverrideAction: {
                  type: "object",
                  properties: {
                    Type: {
                      type: "string",
                    },
                  },
                  required: ["Type"],
                  additionalProperties: false,
                },
                Type: {
                  type: "string",
                },
                ExcludedRules: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      RuleId: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    required: ["RuleId"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["Priority", "RuleId"],
              additionalProperties: false,
            },
            description: "An array of ActivatedRules objects.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listActivatedRulesInRuleGroup;
