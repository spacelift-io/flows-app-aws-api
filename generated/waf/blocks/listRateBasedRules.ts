import { AppBlock, events } from "@slflows/sdk/v1";
import { WAFClient, ListRateBasedRulesCommand } from "@aws-sdk/client-waf";

const listRateBasedRules: AppBlock = {
  name: "List Rate Based Rules",
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
        NextMarker: {
          name: "Next Marker",
          description:
            "If you specify a value for Limit and you have more Rules than the value of Limit, AWS WAF returns a NextMarker value in the response that allows you to list another group of Rules.",
          type: "string",
          required: false,
        },
        Limit: {
          name: "Limit",
          description:
            "Specifies the number of Rules that you want AWS WAF to return for this request.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new ListRateBasedRulesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Rate Based Rules Result",
      description: "Result from ListRateBasedRules operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NextMarker: {
            type: "string",
            description:
              "If you have more Rules than the number that you specified for Limit in the request, the response includes a NextMarker value.",
          },
          Rules: {
            type: "array",
            items: {
              type: "object",
              properties: {
                RuleId: {
                  type: "string",
                },
                Name: {
                  type: "string",
                },
              },
              required: ["RuleId", "Name"],
              additionalProperties: false,
            },
            description: "An array of RuleSummary objects.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listRateBasedRules;
