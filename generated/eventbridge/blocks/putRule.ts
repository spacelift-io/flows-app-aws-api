import { AppBlock, events } from "@slflows/sdk/v1";
import { EventBridgeClient, PutRuleCommand } from "@aws-sdk/client-eventbridge";

const putRule: AppBlock = {
  name: "Put Rule",
  description: "Creates or updates the specified rule.",
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
          description:
            "The name of the rule that you are creating or updating.",
          type: "string",
          required: true,
        },
        ScheduleExpression: {
          name: "Schedule Expression",
          description: "The scheduling expression.",
          type: "string",
          required: false,
        },
        EventPattern: {
          name: "Event Pattern",
          description: "The event pattern.",
          type: "string",
          required: false,
        },
        State: {
          name: "State",
          description: "The state of the rule.",
          type: "string",
          required: false,
        },
        Description: {
          name: "Description",
          description: "A description of the rule.",
          type: "string",
          required: false,
        },
        RoleArn: {
          name: "Role Arn",
          description:
            "The Amazon Resource Name (ARN) of the IAM role associated with the rule.",
          type: "string",
          required: false,
        },
        Tags: {
          name: "Tags",
          description:
            "The list of key-value pairs to associate with the rule.",
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
        EventBusName: {
          name: "Event Bus Name",
          description:
            "The name or ARN of the event bus to associate with this rule.",
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
        });

        const command = new PutRuleCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Rule Result",
      description: "Result from PutRule operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          RuleArn: {
            type: "string",
            description: "The Amazon Resource Name (ARN) of the rule.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default putRule;
