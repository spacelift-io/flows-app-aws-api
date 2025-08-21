import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  GetGeneratedTemplateCommand,
} from "@aws-sdk/client-cloudformation";

const getGeneratedTemplate: AppBlock = {
  name: "Get Generated Template",
  description: "Retrieves a generated template.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Format: {
          name: "Format",
          description:
            "The language to use to retrieve for the generated template.",
          type: "string",
          required: false,
        },
        GeneratedTemplateName: {
          name: "Generated Template Name",
          description:
            "The name or Amazon Resource Name (ARN) of the generated template.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudFormationClient({
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

        const command = new GetGeneratedTemplateCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Generated Template Result",
      description: "Result from GetGeneratedTemplate operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Status: {
            type: "string",
            description: "The status of the template generation.",
          },
          TemplateBody: {
            type: "string",
            description:
              "The template body of the generated template, in the language specified by the Language parameter.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getGeneratedTemplate;
