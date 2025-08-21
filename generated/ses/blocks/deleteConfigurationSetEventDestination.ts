import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SESClient,
  DeleteConfigurationSetEventDestinationCommand,
} from "@aws-sdk/client-ses";

const deleteConfigurationSetEventDestination: AppBlock = {
  name: "Delete Configuration Set Event Destination",
  description: "Deletes a configuration set event destination.",
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
            "The name of the configuration set from which to delete the event destination.",
          type: "string",
          required: true,
        },
        EventDestinationName: {
          name: "Event Destination Name",
          description: "The name of the event destination to delete.",
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

        const command = new DeleteConfigurationSetEventDestinationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Configuration Set Event Destination Result",
      description:
        "Result from DeleteConfigurationSetEventDestination operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default deleteConfigurationSetEventDestination;
