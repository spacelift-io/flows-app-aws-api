import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EventBridgeClient,
  DisableRuleCommand,
} from "@aws-sdk/client-eventbridge";

const disableRule: AppBlock = {
  name: "Disable Rule",
  description: "Disables the specified rule.",
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
          description: "The name of the rule.",
          type: "string",
          required: true,
        },
        EventBusName: {
          name: "Event Bus Name",
          description:
            "The name or ARN of the event bus associated with the rule.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new EventBridgeClient({
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

        const command = new DisableRuleCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Disable Rule Result",
      description: "Result from DisableRule operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default disableRule;
