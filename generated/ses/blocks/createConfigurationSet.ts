import { AppBlock, events } from "@slflows/sdk/v1";
import { SESClient, CreateConfigurationSetCommand } from "@aws-sdk/client-ses";

const createConfigurationSet: AppBlock = {
  name: "Create Configuration Set",
  description: "Creates a configuration set.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ConfigurationSet: {
          name: "Configuration Set",
          description:
            "A data structure that contains the name of the configuration set.",
          type: {
            type: "object",
            properties: {
              Name: {
                type: "string",
              },
            },
            required: ["Name"],
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

        const command = new CreateConfigurationSetCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Configuration Set Result",
      description: "Result from CreateConfigurationSet operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default createConfigurationSet;
