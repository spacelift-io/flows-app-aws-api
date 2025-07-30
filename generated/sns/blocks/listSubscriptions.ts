import { AppBlock, events } from "@slflows/sdk/v1";
import { SNSClient, ListSubscriptionsCommand } from "@aws-sdk/client-sns";

const listSubscriptions: AppBlock = {
  name: "List Subscriptions",
  description: "Returns a list of the requester's subscriptions.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        NextToken: {
          name: "Next Token",
          description:
            "Token returned by the previous ListSubscriptions request.",
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
        });

        const command = new ListSubscriptionsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Subscriptions Result",
      description: "Result from ListSubscriptions operation",
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
              "Token to pass along to the next ListSubscriptions request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listSubscriptions;
