import { AppBlock, events } from "@slflows/sdk/v1";
import { SNSClient, UnsubscribeCommand } from "@aws-sdk/client-sns";

const unsubscribe: AppBlock = {
  name: "Unsubscribe",
  description: "Deletes a subscription.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        SubscriptionArn: {
          name: "Subscription Arn",
          description: "The ARN of the subscription to be deleted.",
          type: "string",
          required: true,
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

        const command = new UnsubscribeCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Unsubscribe Result",
      description: "Result from Unsubscribe operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default unsubscribe;
