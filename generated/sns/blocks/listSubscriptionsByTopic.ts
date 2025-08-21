import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SNSClient,
  ListSubscriptionsByTopicCommand,
} from "@aws-sdk/client-sns";

const listSubscriptionsByTopic: AppBlock = {
  name: "List Subscriptions By Topic",
  description: "Returns a list of the subscriptions to a specific topic.",
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
          description:
            "The ARN of the topic for which you wish to find subscriptions.",
          type: "string",
          required: true,
        },
        NextToken: {
          name: "Next Token",
          description:
            "Token returned by the previous ListSubscriptionsByTopic request.",
          type: "string",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new ListSubscriptionsByTopicCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Subscriptions By Topic Result",
      description: "Result from ListSubscriptionsByTopic operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Subscriptions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                SubscriptionArn: {
                  type: "string",
                },
                Owner: {
                  type: "string",
                },
                Protocol: {
                  type: "string",
                },
                Endpoint: {
                  type: "string",
                },
                TopicArn: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "A list of subscriptions.",
          },
          NextToken: {
            type: "string",
            description:
              "Token to pass along to the next ListSubscriptionsByTopic request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listSubscriptionsByTopic;
