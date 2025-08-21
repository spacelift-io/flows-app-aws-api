import { AppBlock, events } from "@slflows/sdk/v1";
import { ECRClient, DescribeRepositoriesCommand } from "@aws-sdk/client-ecr";

const describeRepositories: AppBlock = {
  name: "Describe Repositories",
  description: "Describes image repositories in a registry.",
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
            "The Amazon Web Services account ID associated with the registry that contains the repositories to be described.",
          type: "string",
          required: false,
        },
        repositoryNames: {
          name: "repository Names",
          description: "A list of repositories to describe.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        nextToken: {
          name: "next Token",
          description:
            "The nextToken value returned from a previous paginated DescribeRepositories request where maxResults was used and the results exceeded the value of that parameter.",
          type: "string",
          required: false,
        },
        maxResults: {
          name: "max Results",
          description:
            "The maximum number of repository results returned by DescribeRepositories in paginated output.",
          type: "number",
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

        const command = new DescribeRepositoriesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Repositories Result",
      description: "Result from DescribeRepositories operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          repositories: {
            type: "array",
            items: {
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
                        type: "object",
                        additionalProperties: true,
                      },
                      filter: {
                        type: "object",
                        additionalProperties: true,
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
            },
            description:
              "A list of repository objects corresponding to valid repositories.",
          },
          nextToken: {
            type: "string",
            description:
              "The nextToken value to include in a future DescribeRepositories request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeRepositories;
