import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudWatchClient,
  EnableInsightRulesCommand,
} from "@aws-sdk/client-cloudwatch";

const enableInsightRules: AppBlock = {
  name: "Enable Insight Rules",
  description: "Enables the specified Contributor Insights rules.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        RuleNames: {
          name: "Rule Names",
          description: "An array of the rule names to enable.",
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

        const client = new CloudWatchClient({
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

        const command = new EnableInsightRulesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Enable Insight Rules Result",
      description: "Result from EnableInsightRules operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Failures: {
            type: "array",
            items: {
              type: "object",
              properties: {
                FailureResource: {
                  type: "string",
                },
                ExceptionType: {
                  type: "string",
                },
                FailureCode: {
                  type: "string",
                },
                FailureDescription: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "An array listing the rules that could not be enabled.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default enableInsightRules;
