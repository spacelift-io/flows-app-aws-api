import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SESClient,
  GetAccountSendingEnabledCommand,
} from "@aws-sdk/client-ses";

const getAccountSendingEnabled: AppBlock = {
  name: "Get Account Sending Enabled",
  description:
    "Returns the email sending status of the Amazon SES account for the current Region.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
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

        const command = new GetAccountSendingEnabledCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Account Sending Enabled Result",
      description: "Result from GetAccountSendingEnabled operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Enabled: {
            type: "boolean",
            description:
              "Describes whether email sending is enabled or disabled for your Amazon SES account in the current Amazon Web Services Region.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getAccountSendingEnabled;
