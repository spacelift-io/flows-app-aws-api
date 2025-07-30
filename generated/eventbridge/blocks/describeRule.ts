import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EventBridgeClient,
  DescribeRuleCommand,
} from "@aws-sdk/client-eventbridge";

const describeRule: AppBlock = {
  name: "Describe Rule",
  description: "Describes the specified rule.",
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
        });

        const command = new DescribeRuleCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Rule Result",
      description: "Result from DescribeRule operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Name: {
            type: "string",
            description: "The name of the rule.",
          },
          Arn: {
            type: "string",
            description: "The Amazon Resource Name (ARN) of the rule.",
          },
          EventPattern: {
            type: "string",
            description: "The event pattern.",
          },
          ScheduleExpression: {
            type: "string",
            description: "The scheduling expression.",
          },
          State: {
            type: "string",
            description: "Specifies whether the rule is enabled or disabled.",
          },
          Description: {
            type: "string",
            description: "The description of the rule.",
          },
          RoleArn: {
            type: "string",
            description:
              "The Amazon Resource Name (ARN) of the IAM role associated with the rule.",
          },
          ManagedBy: {
            type: "string",
            description:
              "If this is a managed rule, created by an Amazon Web Services service on your behalf, this field displays the principal name of the Amazon Web Services service that created the rule.",
          },
          EventBusName: {
            type: "string",
            description: "The name of the event bus associated with the rule.",
          },
          CreatedBy: {
            type: "string",
            description: "The account ID of the user that created the rule.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeRule;
