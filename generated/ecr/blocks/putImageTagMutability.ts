import { AppBlock, events } from "@slflows/sdk/v1";
import { ECRClient, PutImageTagMutabilityCommand } from "@aws-sdk/client-ecr";

const putImageTagMutability: AppBlock = {
  name: "Put Image Tag Mutability",
  description:
    "Updates the image tag mutability settings for the specified repository.",
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
            "The Amazon Web Services account ID associated with the registry that contains the repository in which to update the image tag mutability settings.",
          type: "string",
          required: false,
        },
        repositoryName: {
          name: "repository Name",
          description:
            "The name of the repository in which to update the image tag mutability settings.",
          type: "string",
          required: true,
        },
        imageTagMutability: {
          name: "image Tag Mutability",
          description: "The tag mutability setting for the repository.",
          type: "string",
          required: true,
        },
        imageTagMutabilityExclusionFilters: {
          name: "image Tag Mutability Exclusion Filters",
          description:
            "Creates or updates a repository with filters that define which image tags can override the default image tag mutability setting.",
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

        const command = new PutImageTagMutabilityCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Image Tag Mutability Result",
      description: "Result from PutImageTagMutability operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          registryId: {
            type: "string",
            description: "The registry ID associated with the request.",
          },
          repositoryName: {
            type: "string",
            description: "The repository name associated with the request.",
          },
          imageTagMutability: {
            type: "string",
            description: "The image tag mutability setting for the repository.",
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
            description:
              "Returns a list of filters that were defined for a repository.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default putImageTagMutability;
