import { AppBlock, events } from "@slflows/sdk/v1";
import {
  ECRClient,
  UpdateRepositoryCreationTemplateCommand,
} from "@aws-sdk/client-ecr";

const updateRepositoryCreationTemplate: AppBlock = {
  name: "Update Repository Creation Template",
  description: "Updates an existing repository creation template.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        prefix: {
          name: "prefix",
          description:
            "The repository namespace prefix that matches an existing repository creation template in the registry.",
          type: "string",
          required: true,
        },
        description: {
          name: "description",
          description: "A description for the repository creation template.",
          type: "string",
          required: false,
        },
        encryptionConfiguration: {
          name: "encryption Configuration",
          description:
            "The encryption configuration to associate with the repository creation template.",
          type: {
            type: "object",
            properties: {
              encryptionType: {
                type: "string",
              },
              kmsKey: {
                type: "string",
              },
            },
            required: ["encryptionType"],
            additionalProperties: false,
          },
          required: false,
        },
        resourceTags: {
          name: "resource Tags",
          description:
            "The metadata to apply to the repository to help you categorize and organize.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Key: {
                  type: "string",
                },
                Value: {
                  type: "string",
                },
              },
              required: ["Key", "Value"],
              additionalProperties: false,
            },
          },
          required: false,
        },
        imageTagMutability: {
          name: "image Tag Mutability",
          description: "Updates the tag mutability setting for the repository.",
          type: "string",
          required: false,
        },
        imageTagMutabilityExclusionFilters: {
          name: "image Tag Mutability Exclusion Filters",
          description:
            "Updates a repository with filters that define which image tags can override the default image tag mutability setting.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                filterType: {
                  type: "string",
                },
                filter: {
                  type: "string",
                },
              },
              required: ["filterType", "filter"],
              additionalProperties: false,
            },
          },
          required: false,
        },
        repositoryPolicy: {
          name: "repository Policy",
          description:
            "Updates the repository policy created using the template.",
          type: "string",
          required: false,
        },
        lifecyclePolicy: {
          name: "lifecycle Policy",
          description:
            "Updates the lifecycle policy associated with the specified repository creation template.",
          type: "string",
          required: false,
        },
        appliedFor: {
          name: "applied For",
          description:
            "Updates the list of enumerable strings representing the Amazon ECR repository creation scenarios that this template will apply towards.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        customRoleArn: {
          name: "custom Role Arn",
          description: "The ARN of the role to be assumed by Amazon ECR.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new ECRClient({
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

        const command = new UpdateRepositoryCreationTemplateCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Repository Creation Template Result",
      description: "Result from UpdateRepositoryCreationTemplate operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          registryId: {
            type: "string",
            description: "The registry ID associated with the request.",
          },
          repositoryCreationTemplate: {
            type: "object",
            properties: {
              prefix: {
                type: "string",
              },
              description: {
                type: "string",
              },
              encryptionConfiguration: {
                type: "object",
                properties: {
                  encryptionType: {
                    type: "string",
                  },
                  kmsKey: {
                    type: "string",
                  },
                },
                required: ["encryptionType"],
                additionalProperties: false,
              },
              resourceTags: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Key: {
                      type: "string",
                    },
                    Value: {
                      type: "string",
                    },
                  },
                  required: ["Key", "Value"],
                  additionalProperties: false,
                },
              },
              imageTagMutability: {
                type: "string",
              },
              imageTagMutabilityExclusionFilters: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    filterType: {
                      type: "string",
                    },
                    filter: {
                      type: "string",
                    },
                  },
                  required: ["filterType", "filter"],
                  additionalProperties: false,
                },
              },
              repositoryPolicy: {
                type: "string",
              },
              lifecyclePolicy: {
                type: "string",
              },
              appliedFor: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              customRoleArn: {
                type: "string",
              },
              createdAt: {
                type: "string",
              },
              updatedAt: {
                type: "string",
              },
            },
            additionalProperties: false,
            description:
              "The details of the repository creation template associated with the request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateRepositoryCreationTemplate;
