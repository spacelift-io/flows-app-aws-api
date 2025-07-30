import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SESClient,
  UpdateConfigurationSetSendingEnabledCommand,
} from "@aws-sdk/client-ses";

const updateConfigurationSetSendingEnabled: AppBlock = {
  name: "Update Configuration Set Sending Enabled",
  description:
    "Enables or disables email sending for messages sent using a specific configuration set in a given Amazon Web Services Region.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ConfigurationSetName: {
          name: "Configuration Set Name",
          description: "The name of the configuration set to update.",
          type: "string",
          required: true,
        },
        Enabled: {
          name: "Enabled",
          description:
            "Describes whether email sending is enabled or disabled for the configuration set.",
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

        const command = new UpdateConfigurationSetSendingEnabledCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Configuration Set Sending Enabled Result",
      description: "Result from UpdateConfigurationSetSendingEnabled operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default updateConfigurationSetSendingEnabled;
