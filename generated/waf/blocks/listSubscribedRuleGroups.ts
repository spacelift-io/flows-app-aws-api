import { AppBlock, events } from "@slflows/sdk/v1";
import {
  WAFClient,
  ListSubscribedRuleGroupsCommand,
} from "@aws-sdk/client-waf";

const listSubscribedRuleGroups: AppBlock = {
  name: "List Subscribed Rule Groups",
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
            "If you specify a value for Limit and you have more ByteMatchSetssubscribed rule groups than the value of Limit, AWS WAF returns a NextMarker value in the response that allows you to list another group of subscribed rule groups.",
          type: "string",
          required: false,
        },
        Limit: {
          name: "Limit",
          description:
            "Specifies the number of subscribed rule groups that you want AWS WAF to return for this request.",
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

        const command = new ListSubscribedRuleGroupsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Subscribed Rule Groups Result",
      description: "Result from ListSubscribedRuleGroups operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NextMarker: {
            type: "string",
            description:
              "If you have more objects than the number that you specified for Limit in the request, the response includes a NextMarker value.",
          },
          RuleGroups: {
            type: "array",
            items: {
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
              required: ["RuleGroupId", "Name", "MetricName"],
              additionalProperties: false,
            },
            description: "An array of RuleGroup objects.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listSubscribedRuleGroups;
