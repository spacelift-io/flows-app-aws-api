import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EventBridgeClient,
  DeleteRuleCommand,
} from "@aws-sdk/client-eventbridge";

const deleteRule: AppBlock = {
  name: "Delete Rule",
  description: "Deletes the specified rule.",
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
        Force: {
          name: "Force",
          description:
            "If this is a managed rule, created by an Amazon Web Services service on your behalf, you must specify Force as True to delete the rule.",
          type: "boolean",
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

        const command = new DeleteRuleCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Rule Result",
      description: "Result from DeleteRule operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteRule;
