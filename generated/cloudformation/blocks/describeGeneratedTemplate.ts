import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  DescribeGeneratedTemplateCommand,
} from "@aws-sdk/client-cloudformation";

const describeGeneratedTemplate: AppBlock = {
  name: "Describe Generated Template",
  description: "Describes a generated template.",
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

        const command = new DescribeGeneratedTemplateCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Generated Template Result",
      description: "Result from DescribeGeneratedTemplate operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          GeneratedTemplateId: {
            type: "string",
            description:
              "The Amazon Resource Name (ARN) of the generated template.",
          },
          GeneratedTemplateName: {
            type: "string",
            description: "The name of the generated template.",
          },
          Resources: {
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
                ResourceStatus: {
                  type: "string",
                },
                ResourceStatusReason: {
                  type: "string",
                },
                Warnings: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Type: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Properties: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
              },
              additionalProperties: false,
            },
            description:
              "A list of objects describing the details of the resources in the template generation.",
          },
          Status: {
            type: "string",
            description: "The status of the template generation.",
          },
          StatusReason: {
            type: "string",
            description:
              "The reason for the current template generation status.",
          },
          CreationTime: {
            type: "string",
            description: "The time the generated template was created.",
          },
          LastUpdatedTime: {
            type: "string",
            description: "The time the generated template was last updated.",
          },
          Progress: {
            type: "object",
            properties: {
              ResourcesSucceeded: {
                type: "number",
              },
              ResourcesFailed: {
                type: "number",
              },
              ResourcesProcessing: {
                type: "number",
              },
              ResourcesPending: {
                type: "number",
              },
            },
            additionalProperties: false,
            description:
              "An object describing the progress of the template generation.",
          },
          StackId: {
            type: "string",
            description:
              "The stack ARN of the base stack if a base stack was provided when generating the template.",
          },
          TemplateConfiguration: {
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
            description:
              "The configuration details of the generated template, including the DeletionPolicy and UpdateReplacePolicy.",
          },
          TotalWarnings: {
            type: "number",
            description: "The number of warnings generated for this template.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeGeneratedTemplate;
