import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SESClient,
  DeleteConfigurationSetTrackingOptionsCommand,
} from "@aws-sdk/client-ses";

const deleteConfigurationSetTrackingOptions: AppBlock = {
  name: "Delete Configuration Set Tracking Options",
  description:
    "Deletes an association between a configuration set and a custom domain for open and click event tracking.",
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
          description: "The name of the configuration set.",
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

        const command = new DeleteConfigurationSetTrackingOptionsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Configuration Set Tracking Options Result",
      description:
        "Result from DeleteConfigurationSetTrackingOptions operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default deleteConfigurationSetTrackingOptions;
