import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  CreateGeneratedTemplateCommand,
} from "@aws-sdk/client-cloudformation";

const createGeneratedTemplate: AppBlock = {
  name: "Create Generated Template",
  description:
    "Creates a template from existing resources that are not already managed with CloudFormation.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Resources: {
          name: "Resources",
          description:
            "An optional list of resources to be included in the generated template.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ResourceType: {
                  type: "string",
                },
                LogicalResourceId: {
                  type: "string",
                },
                ResourceIdentifier: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                },
              },
              required: ["ResourceType", "ResourceIdentifier"],
              additionalProperties: false,
            },
          },
          required: false,
        },
        GeneratedTemplateName: {
          name: "Generated Template Name",
          description: "The name assigned to the generated template.",
          type: "string",
          required: true,
        },
        StackName: {
          name: "Stack Name",
          description:
            "An optional name or ARN of a stack to use as the base stack for the generated template.",
          type: "string",
          required: false,
        },
        TemplateConfiguration: {
          name: "Template Configuration",
          description:
            "The configuration details of the generated template, including the DeletionPolicy and UpdateReplacePolicy.",
          type: {
            type: "object",
            properties: {
              DeletionPolicy: {
                type: "string",
              },
              UpdateReplacePolicy: {
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

        const command = new CreateGeneratedTemplateCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Generated Template Result",
      description: "Result from CreateGeneratedTemplate operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          GeneratedTemplateId: {
            type: "string",
            description: "The ID of the generated template.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createGeneratedTemplate;
