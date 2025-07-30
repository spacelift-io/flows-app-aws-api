import { AppBlock, events } from "@slflows/sdk/v1";
import { SESClient, TestRenderTemplateCommand } from "@aws-sdk/client-ses";

const testRenderTemplate: AppBlock = {
  name: "Test Render Template",
  description:
    "Creates a preview of the MIME content of an email when provided with a template and a set of replacement data.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TemplateName: {
          name: "Template Name",
          description: "The name of the template to render.",
          type: "string",
          required: true,
        },
        TemplateData: {
          name: "Template Data",
          description: "A list of replacement values to apply to the template.",
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
        });

        const command = new TestRenderTemplateCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Test Render Template Result",
      description: "Result from TestRenderTemplate operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          RenderedTemplate: {
            type: "string",
            description:
              "The complete MIME message rendered by applying the data in the TemplateData parameter to the template specified in the TemplateName parameter.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default testRenderTemplate;
