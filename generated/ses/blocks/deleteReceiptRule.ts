import { AppBlock, events } from "@slflows/sdk/v1";
import { SESClient, DeleteReceiptRuleCommand } from "@aws-sdk/client-ses";

const deleteReceiptRule: AppBlock = {
  name: "Delete Receipt Rule",
  description: "Deletes the specified receipt rule.",
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
            "The name of the receipt rule set that contains the receipt rule to delete.",
          type: "string",
          required: true,
        },
        RuleName: {
          name: "Rule Name",
          description: "The name of the receipt rule to delete.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new DeleteReceiptRuleCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Receipt Rule Result",
      description: "Result from DeleteReceiptRule operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default deleteReceiptRule;
