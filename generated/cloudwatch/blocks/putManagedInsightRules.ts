import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudWatchClient,
  PutManagedInsightRulesCommand,
} from "@aws-sdk/client-cloudwatch";

const putManagedInsightRules: AppBlock = {
  name: "Put Managed Insight Rules",
  description:
    "Creates a managed Contributor Insights rule for a specified Amazon Web Services resource.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ManagedRules: {
          name: "Managed Rules",
          description: "A list of ManagedRules to enable.",
          type: {
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
                Tags: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Key: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Value: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    required: ["Key", "Value"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["TemplateName", "ResourceARN"],
              additionalProperties: false,
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

        const command = new PutManagedInsightRulesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Managed Insight Rules Result",
      description: "Result from PutManagedInsightRules operation",
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
              "An array that lists the rules that could not be enabled.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default putManagedInsightRules;
