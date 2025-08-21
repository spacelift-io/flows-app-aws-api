import { AppBlock, events } from "@slflows/sdk/v1";
import { SESClient, UpdateTemplateCommand } from "@aws-sdk/client-ses";

const updateTemplate: AppBlock = {
  name: "Update Template",
  description: "Updates an email template.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Template: {
          name: "Template",
          description:
            "The content of the email, composed of a subject line and either an HTML part or a text-only part.",
          type: {
            type: "object",
            properties: {
              TemplateName: {
                type: "string",
              },
              SubjectPart: {
                type: "string",
              },
              TextPart: {
                type: "string",
              },
              HtmlPart: {
                type: "string",
              },
            },
            required: ["TemplateName"],
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

        const command = new UpdateTemplateCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Template Result",
      description: "Result from UpdateTemplate operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default updateTemplate;
