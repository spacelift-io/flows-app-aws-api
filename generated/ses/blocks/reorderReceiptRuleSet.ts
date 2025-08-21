import { AppBlock, events } from "@slflows/sdk/v1";
import { SESClient, ReorderReceiptRuleSetCommand } from "@aws-sdk/client-ses";

const reorderReceiptRuleSet: AppBlock = {
  name: "Reorder Receipt Rule Set",
  description: "Reorders the receipt rules within a receipt rule set.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        RuleSetName: {
          name: "Rule Set Name",
          description: "The name of the receipt rule set to reorder.",
          type: "string",
          required: true,
        },
        RuleNames: {
          name: "Rule Names",
          description:
            "The specified receipt rule set's receipt rules, in order.",
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

        const client = new SESClient({
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

        const command = new ReorderReceiptRuleSetCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Reorder Receipt Rule Set Result",
      description: "Result from ReorderReceiptRuleSet operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default reorderReceiptRuleSet;
