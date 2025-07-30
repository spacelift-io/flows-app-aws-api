import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SESClient,
  SetIdentityFeedbackForwardingEnabledCommand,
} from "@aws-sdk/client-ses";

const setIdentityFeedbackForwardingEnabled: AppBlock = {
  name: "Set Identity Feedback Forwarding Enabled",
  description:
    "Given an identity (an email address or a domain), enables or disables whether Amazon SES forwards bounce and complaint notifications as email.",
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
            "The identity for which to set bounce and complaint notification forwarding.",
          type: "string",
          required: true,
        },
        ForwardingEnabled: {
          name: "Forwarding Enabled",
          description:
            "Sets whether Amazon SES forwards bounce and complaint notifications as email.",
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
        });

        const command = new SetIdentityFeedbackForwardingEnabledCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Set Identity Feedback Forwarding Enabled Result",
      description: "Result from SetIdentityFeedbackForwardingEnabled operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default setIdentityFeedbackForwardingEnabled;
