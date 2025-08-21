import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SESClient,
  CreateConfigurationSetTrackingOptionsCommand,
} from "@aws-sdk/client-ses";

const createConfigurationSetTrackingOptions: AppBlock = {
  name: "Create Configuration Set Tracking Options",
  description:
    "Creates an association between a configuration set and a custom domain for open and click event tracking.",
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
          description:
            "The name of the configuration set that the tracking options should be associated with.",
          type: "string",
          required: true,
        },
        TrackingOptions: {
          name: "Tracking Options",
          description:
            "A domain that is used to redirect email recipients to an Amazon SES-operated domain.",
          type: {
            type: "object",
            properties: {
              CustomRedirectDomain: {
                type: "string",
              },
            },
            additionalProperties: false,
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new CreateConfigurationSetTrackingOptionsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Configuration Set Tracking Options Result",
      description:
        "Result from CreateConfigurationSetTrackingOptions operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default createConfigurationSetTrackingOptions;
