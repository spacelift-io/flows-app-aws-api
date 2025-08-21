import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SESClient,
  SetIdentityNotificationTopicCommand,
} from "@aws-sdk/client-ses";

const setIdentityNotificationTopic: AppBlock = {
  name: "Set Identity Notification Topic",
  description:
    "Sets an Amazon Simple Notification Service (Amazon SNS) topic to use when delivering notifications.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Identity: {
          name: "Identity",
          description:
            "The identity (email address or domain) for the Amazon SNS topic.",
          type: "string",
          required: true,
        },
        NotificationType: {
          name: "Notification Type",
          description:
            "The type of notifications that are published to the specified Amazon SNS topic.",
          type: "string",
          required: true,
        },
        SnsTopic: {
          name: "Sns Topic",
          description:
            "The Amazon Resource Name (ARN) of the Amazon SNS topic.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new SESClient({
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

        const command = new SetIdentityNotificationTopicCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Set Identity Notification Topic Result",
      description: "Result from SetIdentityNotificationTopic operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default setIdentityNotificationTopic;
