import { AppBlock, events } from "@slflows/sdk/v1";
import { SESClient, ListConfigurationSetsCommand } from "@aws-sdk/client-ses";

const listConfigurationSets: AppBlock = {
  name: "List Configuration Sets",
  description:
    "Provides a list of the configuration sets associated with your Amazon SES account in the current Amazon Web Services Region.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        NextToken: {
          name: "Next Token",
          description:
            "A token returned from a previous call to ListConfigurationSets to indicate the position of the configuration set in the configuration set list.",
          type: "string",
          required: false,
        },
        MaxItems: {
          name: "Max Items",
          description: "The number of configuration sets to return.",
          type: "number",
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

        const command = new ListConfigurationSetsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Configuration Sets Result",
      description: "Result from ListConfigurationSets operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ConfigurationSets: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: {
                  type: "string",
                },
              },
              required: ["Name"],
              additionalProperties: false,
            },
            description: "A list of configuration sets.",
          },
          NextToken: {
            type: "string",
            description:
              "A token indicating that there are additional configuration sets available to be listed.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listConfigurationSets;
