import { AppBlock, events } from "@slflows/sdk/v1";
import { SNSClient, SubscribeCommand } from "@aws-sdk/client-sns";

const subscribe: AppBlock = {
  name: "Subscribe",
  description: "Subscribes an endpoint to an Amazon SNS topic.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TopicArn: {
          name: "Topic Arn",
          description: "The ARN of the topic you want to subscribe to.",
          type: "string",
          required: true,
        },
        Protocol: {
          name: "Protocol",
          description: "The protocol that you want to use.",
          type: "string",
          required: true,
        },
        Endpoint: {
          name: "Endpoint",
          description: "The endpoint that you want to receive notifications.",
          type: "string",
          required: false,
        },
        Attributes: {
          name: "Attributes",
          description: "A map of attributes with their corresponding values.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
          },
          required: false,
        },
        ReturnSubscriptionArn: {
          name: "Return Subscription Arn",
          description:
            "Sets whether the response from the Subscribe request includes the subscription ARN, even if the subscription is not yet confirmed.",
          type: "boolean",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new SNSClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new SubscribeCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Subscribe Result",
      description: "Result from Subscribe operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          SubscriptionArn: {
            type: "string",
            description:
              'The ARN of the subscription if it is confirmed, or the string "pending confirmation" if the subscription requires confirmation.',
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default subscribe;
