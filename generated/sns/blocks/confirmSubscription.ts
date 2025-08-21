import { AppBlock, events } from "@slflows/sdk/v1";
import { SNSClient, ConfirmSubscriptionCommand } from "@aws-sdk/client-sns";

const confirmSubscription: AppBlock = {
  name: "Confirm Subscription",
  description:
    "Verifies an endpoint owner's intent to receive messages by validating the token sent to the endpoint by an earlier Subscribe action.",
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
            "The ARN of the topic for which you wish to confirm a subscription.",
          type: "string",
          required: true,
        },
        Token: {
          name: "Token",
          description:
            "Short-lived token sent to an endpoint during the Subscribe action.",
          type: "string",
          required: true,
        },
        AuthenticateOnUnsubscribe: {
          name: "Authenticate On Unsubscribe",
          description:
            "Disallows unauthenticated unsubscribes of the subscription.",
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

        const command = new ConfirmSubscriptionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Confirm Subscription Result",
      description: "Result from ConfirmSubscription operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          SubscriptionArn: {
            type: "string",
            description: "The ARN of the created subscription.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default confirmSubscription;
