import { AppBlock, events } from "@slflows/sdk/v1";
import { SESClient, SetReceiptRulePositionCommand } from "@aws-sdk/client-ses";

const setReceiptRulePosition: AppBlock = {
  name: "Set Receipt Rule Position",
  description:
    "Sets the position of the specified receipt rule in the receipt rule set.",
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
          description:
            "The name of the receipt rule set that contains the receipt rule to reposition.",
          type: "string",
          required: true,
        },
        RuleName: {
          name: "Rule Name",
          description: "The name of the receipt rule to reposition.",
          type: "string",
          required: true,
        },
        After: {
          name: "After",
          description:
            "The name of the receipt rule after which to place the specified receipt rule.",
          type: "string",
          required: false,
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

        const command = new SetReceiptRulePositionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Set Receipt Rule Position Result",
      description: "Result from SetReceiptRulePosition operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default setReceiptRulePosition;
