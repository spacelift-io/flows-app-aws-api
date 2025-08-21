import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SESClient,
  SetIdentityHeadersInNotificationsEnabledCommand,
} from "@aws-sdk/client-ses";

const setIdentityHeadersInNotificationsEnabled: AppBlock = {
  name: "Set Identity Headers In Notifications Enabled",
  description:
    "Given an identity (an email address or a domain), sets whether Amazon SES includes the original email headers in the Amazon Simple Notification Service (Amazon SNS) notifications of a specified type.",
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
            "The identity for which to enable or disable headers in notifications.",
          type: "string",
          required: true,
        },
        NotificationType: {
          name: "Notification Type",
          description:
            "The notification type for which to enable or disable headers in notifications.",
          type: "string",
          required: true,
        },
        Enabled: {
          name: "Enabled",
          description:
            "Sets whether Amazon SES includes the original email headers in Amazon SNS notifications of the specified notification type.",
          type: "boolean",
          required: true,
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

        const command = new SetIdentityHeadersInNotificationsEnabledCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Set Identity Headers In Notifications Enabled Result",
      description:
        "Result from SetIdentityHeadersInNotificationsEnabled operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default setIdentityHeadersInNotificationsEnabled;
