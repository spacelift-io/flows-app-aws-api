import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  DeleteGeneratedTemplateCommand,
} from "@aws-sdk/client-cloudformation";

const deleteGeneratedTemplate: AppBlock = {
  name: "Delete Generated Template",
  description: "Deleted a generated template.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        GeneratedTemplateName: {
          name: "Generated Template Name",
          description:
            "The name or Amazon Resource Name (ARN) of a generated template.",
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

        const command = new DeleteGeneratedTemplateCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Generated Template Result",
      description: "Result from DeleteGeneratedTemplate operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteGeneratedTemplate;
