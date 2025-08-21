import { AppBlock, events } from "@slflows/sdk/v1";
import { WAFClient, CreateRuleCommand } from "@aws-sdk/client-waf";

const createRule: AppBlock = {
  name: "Create Rule",
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
        Name: {
          name: "Name",
          description: "A friendly name or description of the Rule.",
          type: "string",
          required: true,
        },
        MetricName: {
          name: "Metric Name",
          description:
            "A friendly name or description for the metrics for this Rule.",
          type: "string",
          required: true,
        },
        ChangeToken: {
          name: "Change Token",
          description:
            "The value returned by the most recent call to GetChangeToken.",
          type: "string",
          required: true,
        },
        Tags: {
          name: "Tags",
          description: "",
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

        const command = new CreateRuleCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Rule Result",
      description: "Result from CreateRule operation",
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
              Predicates: {
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
            },
            required: ["RuleId", "Predicates"],
            additionalProperties: false,
            description: "The Rule returned in the CreateRule response.",
          },
          ChangeToken: {
            type: "string",
            description:
              "The ChangeToken that you used to submit the CreateRule request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createRule;
