import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SESClient,
  GetIdentityNotificationAttributesCommand,
} from "@aws-sdk/client-ses";

const getIdentityNotificationAttributes: AppBlock = {
  name: "Get Identity Notification Attributes",
  description:
    "Given a list of verified identities (email addresses and/or domains), returns a structure describing identity notification attributes.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Identities: {
          name: "Identities",
          description: "A list of one or more identities.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
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
        });

        const command = new GetIdentityNotificationAttributesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Identity Notification Attributes Result",
      description: "Result from GetIdentityNotificationAttributes operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NotificationAttributes: {
            type: "object",
            additionalProperties: {
              type: "object",
            },
            description: "A map of Identity to IdentityNotificationAttributes.",
          },
        },
        required: ["NotificationAttributes"],
      },
    },
  },
};

export default getIdentityNotificationAttributes;
