import { AppBlock, events } from "@slflows/sdk/v1";
import {
  ECRClient,
  DescribeRepositoryCreationTemplatesCommand,
} from "@aws-sdk/client-ecr";

const describeRepositoryCreationTemplates: AppBlock = {
  name: "Describe Repository Creation Templates",
  description:
    "Returns details about the repository creation templates in a registry.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        prefixes: {
          name: "prefixes",
          description:
            "The repository namespace prefixes associated with the repository creation templates to describe.",
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
            "The nextToken value returned from a previous paginated DescribeRepositoryCreationTemplates request where maxResults was used and the results exceeded the value of that parameter.",
          type: "string",
          required: false,
        },
        maxResults: {
          name: "max Results",
          description:
            "The maximum number of repository results returned by DescribeRepositoryCreationTemplatesRequest in paginated output.",
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

        const command = new DescribeRepositoryCreationTemplatesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Repository Creation Templates Result",
      description: "Result from DescribeRepositoryCreationTemplates operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          registryId: {
            type: "string",
            description: "The registry ID associated with the request.",
          },
          repositoryCreationTemplates: {
            type: "array",
            items: {
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
                        type: "object",
                        additionalProperties: true,
                      },
                      Value: {
                        type: "object",
                        additionalProperties: true,
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
            },
            description: "The details of the repository creation templates.",
          },
          nextToken: {
            type: "string",
            description:
              "The nextToken value to include in a future DescribeRepositoryCreationTemplates request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeRepositoryCreationTemplates;
