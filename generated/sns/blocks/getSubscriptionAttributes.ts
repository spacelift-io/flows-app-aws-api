import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SNSClient,
  GetSubscriptionAttributesCommand,
} from "@aws-sdk/client-sns";

const getSubscriptionAttributes: AppBlock = {
  name: "Get Subscription Attributes",
  description: "Returns all of the properties of a subscription.",
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
          description:
            "The ARN of the subscription whose properties you want to get.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new GetSubscriptionAttributesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Subscription Attributes Result",
      description: "Result from GetSubscriptionAttributes operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Attributes: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description: "A map of the subscription's attributes.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getSubscriptionAttributes;
