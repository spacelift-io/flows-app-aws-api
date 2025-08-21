import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SESClient,
  PutConfigurationSetDeliveryOptionsCommand,
} from "@aws-sdk/client-ses";

const putConfigurationSetDeliveryOptions: AppBlock = {
  name: "Put Configuration Set Delivery Options",
  description: "Adds or updates the delivery options for a configuration set.",
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
        DeliveryOptions: {
          name: "Delivery Options",
          description:
            "Specifies whether messages that use the configuration set are required to use Transport Layer Security (TLS).",
          type: {
            type: "object",
            properties: {
              TlsPolicy: {
                type: "string",
              },
            },
            additionalProperties: false,
          },
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

        const command = new PutConfigurationSetDeliveryOptionsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Configuration Set Delivery Options Result",
      description: "Result from PutConfigurationSetDeliveryOptions operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default putConfigurationSetDeliveryOptions;
