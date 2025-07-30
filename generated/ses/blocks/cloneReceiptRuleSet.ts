import { AppBlock, events } from "@slflows/sdk/v1";
import { SESClient, CloneReceiptRuleSetCommand } from "@aws-sdk/client-ses";

const cloneReceiptRuleSet: AppBlock = {
  name: "Clone Receipt Rule Set",
  description: "Creates a receipt rule set by cloning an existing one.",
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
          description: "The name of the rule set to create.",
          type: "string",
          required: true,
        },
        OriginalRuleSetName: {
          name: "Original Rule Set Name",
          description: "The name of the rule set to clone.",
          type: "string",
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
        });

        const command = new CloneReceiptRuleSetCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Clone Receipt Rule Set Result",
      description: "Result from CloneReceiptRuleSet operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default cloneReceiptRuleSet;
