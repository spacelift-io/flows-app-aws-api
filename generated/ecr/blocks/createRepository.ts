import { AppBlock, events } from "@slflows/sdk/v1";
import { ECRClient, CreateRepositoryCommand } from "@aws-sdk/client-ecr";

const createRepository: AppBlock = {
  name: "Create Repository",
  description: "Creates a repository.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        registryId: {
          name: "registry Id",
          description:
            "The Amazon Web Services account ID associated with the registry to create the repository.",
          type: "string",
          required: false,
        },
        repositoryName: {
          name: "repository Name",
          description: "The name to use for the repository.",
          type: "string",
          required: true,
        },
        tags: {
          name: "tags",
          description:
            "The metadata that you apply to the repository to help you categorize and organize them.",
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
          description: "The tag mutability setting for the repository.",
          type: "string",
          required: false,
        },
        imageTagMutabilityExclusionFilters: {
          name: "image Tag Mutability Exclusion Filters",
          description:
            "Creates a repository with a list of filters that define which image tags can override the default image tag mutability setting.",
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
        imageScanningConfiguration: {
          name: "image Scanning Configuration",
          description: "The image scanning configuration for the repository.",
          type: {
            type: "object",
            properties: {
              scanOnPush: {
                type: "boolean",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        encryptionConfiguration: {
          name: "encryption Configuration",
          description: "The encryption configuration for the repository.",
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
        });

        const command = new CreateRepositoryCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Repository Result",
      description: "Result from CreateRepository operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          repository: {
            type: "object",
            properties: {
              repositoryArn: {
                type: "string",
              },
              registryId: {
                type: "string",
              },
              repositoryName: {
                type: "string",
              },
              repositoryUri: {
                type: "string",
              },
              createdAt: {
                type: "string",
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
              imageScanningConfiguration: {
                type: "object",
                properties: {
                  scanOnPush: {
                    type: "boolean",
                  },
                },
                additionalProperties: false,
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
            },
            additionalProperties: false,
            description: "The repository that was created.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createRepository;
