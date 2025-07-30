import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SESClient,
  UpdateConfigurationSetReputationMetricsEnabledCommand,
} from "@aws-sdk/client-ses";

const updateConfigurationSetReputationMetricsEnabled: AppBlock = {
  name: "Update Configuration Set Reputation Metrics Enabled",
  description:
    "Enables or disables the publishing of reputation metrics for emails sent using a specific configuration set in a given Amazon Web Services Region.",
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
            "Describes whether or not Amazon SES publishes reputation metrics for the configuration set, such as bounce and complaint rates, to Amazon CloudWatch.",
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

        const command =
          new UpdateConfigurationSetReputationMetricsEnabledCommand(
            commandInput as any,
          );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Configuration Set Reputation Metrics Enabled Result",
      description:
        "Result from UpdateConfigurationSetReputationMetricsEnabled operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default updateConfigurationSetReputationMetricsEnabled;
