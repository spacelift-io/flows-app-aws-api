import { AppBlock, events } from "@slflows/sdk/v1";
import {
  ECRClient,
  DeleteRepositoryCreationTemplateCommand,
} from "@aws-sdk/client-ecr";

const deleteRepositoryCreationTemplate: AppBlock = {
  name: "Delete Repository Creation Template",
  description: "Deletes a repository creation template.",
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
            "The repository namespace prefix associated with the repository creation template.",
          type: "string",
          required: true,
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

        const command = new DeleteRepositoryCreationTemplateCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Repository Creation Template Result",
      description: "Result from DeleteRepositoryCreationTemplate operation",
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
              "The details of the repository creation template that was deleted.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteRepositoryCreationTemplate;
