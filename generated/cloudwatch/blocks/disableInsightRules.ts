import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudWatchClient,
  DisableInsightRulesCommand,
} from "@aws-sdk/client-cloudwatch";

const disableInsightRules: AppBlock = {
  name: "Disable Insight Rules",
  description: "Disables the specified Contributor Insights rules.",
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
          description: "An array of the rule names to disable.",
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
        });

        const command = new DisableInsightRulesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Disable Insight Rules Result",
      description: "Result from DisableInsightRules operation",
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
              "An array listing the rules that could not be disabled.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default disableInsightRules;
