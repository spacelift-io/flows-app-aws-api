import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudWatchClient,
  ListManagedInsightRulesCommand,
} from "@aws-sdk/client-cloudwatch";

const listManagedInsightRules: AppBlock = {
  name: "List Managed Insight Rules",
  description:
    "Returns a list that contains the number of managed Contributor Insights rules in your account.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ResourceARN: {
          name: "Resource ARN",
          description:
            "The ARN of an Amazon Web Services resource that has managed Contributor Insights rules.",
          type: "string",
          required: true,
        },
        NextToken: {
          name: "Next Token",
          description:
            "Include this value to get the next set of rules if the value was returned by the previous operation.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of results to return in one operation.",
          type: "number",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudWatchClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new ListManagedInsightRulesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Managed Insight Rules Result",
      description: "Result from ListManagedInsightRules operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ManagedRules: {
            type: "array",
            items: {
              type: "object",
              properties: {
                TemplateName: {
                  type: "string",
                },
                ResourceARN: {
                  type: "string",
                },
                RuleState: {
                  type: "object",
                  properties: {
                    RuleName: {
                      type: "string",
                    },
                    State: {
                      type: "string",
                    },
                  },
                  required: ["RuleName", "State"],
                  additionalProperties: false,
                },
              },
              additionalProperties: false,
            },
            description:
              "The managed rules that are available for the specified Amazon Web Services resource.",
          },
          NextToken: {
            type: "string",
            description:
              "Include this value to get the next set of rules if the value was returned by the previous operation.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listManagedInsightRules;
