import { AppBlock, events } from "@slflows/sdk/v1";
import { ECRClient, DeleteRepositoryCommand } from "@aws-sdk/client-ecr";

const deleteRepository: AppBlock = {
  name: "Delete Repository",
  description: "Deletes a repository.",
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
            "The Amazon Web Services account ID associated with the registry that contains the repository to delete.",
          type: "string",
          required: false,
        },
        repositoryName: {
          name: "repository Name",
          description: "The name of the repository to delete.",
          type: "string",
          required: true,
        },
        force: {
          name: "force",
          description:
            "If true, deleting the repository force deletes the contents of the repository.",
          type: "boolean",
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

        const command = new DeleteRepositoryCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Repository Result",
      description: "Result from DeleteRepository operation",
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
            description: "The repository that was deleted.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteRepository;
