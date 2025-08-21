import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SESClient,
  UpdateAccountSendingEnabledCommand,
} from "@aws-sdk/client-ses";

const updateAccountSendingEnabled: AppBlock = {
  name: "Update Account Sending Enabled",
  description:
    "Enables or disables email sending across your entire Amazon SES account in the current Amazon Web Services Region.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Enabled: {
          name: "Enabled",
          description:
            "Describes whether email sending is enabled or disabled for your Amazon SES account in the current Amazon Web Services Region.",
          type: "boolean",
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

        const command = new UpdateAccountSendingEnabledCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Account Sending Enabled Result",
      description: "Result from UpdateAccountSendingEnabled operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default updateAccountSendingEnabled;
