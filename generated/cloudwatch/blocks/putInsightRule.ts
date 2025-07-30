import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudWatchClient,
  PutInsightRuleCommand,
} from "@aws-sdk/client-cloudwatch";

const putInsightRule: AppBlock = {
  name: "Put Insight Rule",
  description: "Creates a Contributor Insights rule.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        RuleName: {
          name: "Rule Name",
          description: "A unique name for the rule.",
          type: "string",
          required: true,
        },
        RuleState: {
          name: "Rule State",
          description: "The state of the rule.",
          type: "string",
          required: false,
        },
        RuleDefinition: {
          name: "Rule Definition",
          description: "The definition of the rule, as a JSON object.",
          type: "string",
          required: true,
        },
        Tags: {
          name: "Tags",
          description:
            "A list of key-value pairs to associate with the Contributor Insights rule.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Key: {
                  type: "string",
                },
                Value: {
                  type: "string",
                },
              },
              required: ["Key", "Value"],
              additionalProperties: false,
            },
          },
          required: false,
        },
        ApplyOnTransformedLogs: {
          name: "Apply On Transformed Logs",
          description:
            "Specify true to have this rule evalute log events after they have been transformed by Log transformation.",
          type: "boolean",
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

        const command = new PutInsightRuleCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Insight Rule Result",
      description: "Result from PutInsightRule operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default putInsightRule;
