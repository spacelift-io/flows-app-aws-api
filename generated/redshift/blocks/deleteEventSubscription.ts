import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  DeleteEventSubscriptionCommand,
} from "@aws-sdk/client-redshift";

const deleteEventSubscription: AppBlock = {
  name: "Delete Event Subscription",
  description: `Deletes an Amazon Redshift event notification subscription.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        SubscriptionName: {
          name: "Subscription Name",
          description:
            "The name of the Amazon Redshift event notification subscription to be deleted.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new RedshiftClient({
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

        const command = new DeleteEventSubscriptionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Event Subscription Result",
      description: "Result from DeleteEventSubscription operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteEventSubscription;
