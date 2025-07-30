import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudWatchClient,
  DescribeInsightRulesCommand,
} from "@aws-sdk/client-cloudwatch";

const describeInsightRules: AppBlock = {
  name: "Describe Insight Rules",
  description:
    "Returns a list of all the Contributor Insights rules in your account.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        NextToken: {
          name: "Next Token",
          description:
            "Include this value, if it was returned by the previous operation, to get the next set of rules.",
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

        const command = new DescribeInsightRulesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Insight Rules Result",
      description: "Result from DescribeInsightRules operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NextToken: {
            type: "string",
            description:
              "If this parameter is present, it is a token that marks the start of the next batch of returned results.",
          },
          InsightRules: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: {
                  type: "string",
                },
                State: {
                  type: "string",
                },
                Schema: {
                  type: "string",
                },
                Definition: {
                  type: "string",
                },
                ManagedRule: {
                  type: "boolean",
                },
                ApplyOnTransformedLogs: {
                  type: "boolean",
                },
              },
              required: ["Name", "State", "Schema", "Definition"],
              additionalProperties: false,
            },
            description: "The rules returned by the operation.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeInsightRules;
