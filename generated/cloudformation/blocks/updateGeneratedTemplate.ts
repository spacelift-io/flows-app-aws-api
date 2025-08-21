import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  UpdateGeneratedTemplateCommand,
} from "@aws-sdk/client-cloudformation";

const updateGeneratedTemplate: AppBlock = {
  name: "Update Generated Template",
  description: "Updates a generated template.",
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
        NewGeneratedTemplateName: {
          name: "New Generated Template Name",
          description:
            "An optional new name to assign to the generated template.",
          type: "string",
          required: false,
        },
        AddResources: {
          name: "Add Resources",
          description:
            "An optional list of resources to be added to the generated template.",
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
        RemoveResources: {
          name: "Remove Resources",
          description:
            "A list of logical ids for resources to remove from the generated template.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        RefreshAllResources: {
          name: "Refresh All Resources",
          description:
            "If true, update the resource properties in the generated template with their current live state.",
          type: "boolean",
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

        const command = new UpdateGeneratedTemplateCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Generated Template Result",
      description: "Result from UpdateGeneratedTemplate operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          GeneratedTemplateId: {
            type: "string",
            description:
              "The Amazon Resource Name (ARN) of the generated template.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateGeneratedTemplate;
