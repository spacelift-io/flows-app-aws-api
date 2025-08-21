import { AppBlock, events } from "@slflows/sdk/v1";
import { SESClient, ListTemplatesCommand } from "@aws-sdk/client-ses";

const listTemplates: AppBlock = {
  name: "List Templates",
  description:
    "Lists the email templates present in your Amazon SES account in the current Amazon Web Services Region.",
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
            "A token returned from a previous call to ListTemplates to indicate the position in the list of email templates.",
          type: "string",
          required: false,
        },
        MaxItems: {
          name: "Max Items",
          description: "The maximum number of templates to return.",
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

        const command = new ListTemplatesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Templates Result",
      description: "Result from ListTemplates operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TemplatesMetadata: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: {
                  type: "string",
                },
                CreatedTimestamp: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "An array the contains the name and creation time stamp for each template in your Amazon SES account.",
          },
          NextToken: {
            type: "string",
            description:
              "A token indicating that there are additional email templates available to be listed.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listTemplates;
