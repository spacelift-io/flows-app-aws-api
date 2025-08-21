import { AppBlock, events } from "@slflows/sdk/v1";
import { WAFClient, CreateRuleGroupCommand } from "@aws-sdk/client-waf";

const createRuleGroup: AppBlock = {
  name: "Create Rule Group",
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
          description: "A friendly name or description of the RuleGroup.",
          type: "string",
          required: true,
        },
        MetricName: {
          name: "Metric Name",
          description:
            "A friendly name or description for the metrics for this RuleGroup.",
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

        const command = new CreateRuleGroupCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Rule Group Result",
      description: "Result from CreateRuleGroup operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          RuleGroup: {
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
            required: ["RuleGroupId"],
            additionalProperties: false,
            description: "An empty RuleGroup.",
          },
          ChangeToken: {
            type: "string",
            description:
              "The ChangeToken that you used to submit the CreateRuleGroup request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createRuleGroup;
