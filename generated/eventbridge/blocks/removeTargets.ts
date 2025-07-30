import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EventBridgeClient,
  RemoveTargetsCommand,
} from "@aws-sdk/client-eventbridge";

const removeTargets: AppBlock = {
  name: "Remove Targets",
  description: "Removes the specified targets from the specified rule.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Rule: {
          name: "Rule",
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
        Ids: {
          name: "Ids",
          description: "The IDs of the targets to remove from the rule.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: true,
        },
        Force: {
          name: "Force",
          description:
            "If this is a managed rule, created by an Amazon Web Services service on your behalf, you must specify Force as True to remove targets.",
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
        });

        const command = new RemoveTargetsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Remove Targets Result",
      description: "Result from RemoveTargets operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          FailedEntryCount: {
            type: "number",
            description: "The number of failed entries.",
          },
          FailedEntries: {
            type: "array",
            items: {
              type: "object",
              properties: {
                TargetId: {
                  type: "string",
                },
                ErrorCode: {
                  type: "string",
                },
                ErrorMessage: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "The failed target entries.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default removeTargets;
