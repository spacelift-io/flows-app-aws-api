import { AppBlock, events } from "@slflows/sdk/v1";
import { ECRClient, ListImagesCommand } from "@aws-sdk/client-ecr";

const listImages: AppBlock = {
  name: "List Images",
  description: "Lists all the image IDs for the specified repository.",
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
            "The Amazon Web Services account ID associated with the registry that contains the repository in which to list images.",
          type: "string",
          required: false,
        },
        repositoryName: {
          name: "repository Name",
          description: "The repository with image IDs to be listed.",
          type: "string",
          required: true,
        },
        nextToken: {
          name: "next Token",
          description:
            "The nextToken value returned from a previous paginated ListImages request where maxResults was used and the results exceeded the value of that parameter.",
          type: "string",
          required: false,
        },
        maxResults: {
          name: "max Results",
          description:
            "The maximum number of image results returned by ListImages in paginated output.",
          type: "number",
          required: false,
        },
        filter: {
          name: "filter",
          description:
            "The filter key and value with which to filter your ListImages results.",
          type: {
            type: "object",
            properties: {
              tagStatus: {
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

        const command = new ListImagesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Images Result",
      description: "Result from ListImages operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          imageIds: {
            type: "array",
            items: {
              type: "object",
              properties: {
                imageDigest: {
                  type: "string",
                },
                imageTag: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "The list of image IDs for the requested repository.",
          },
          nextToken: {
            type: "string",
            description:
              "The nextToken value to include in a future ListImages request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listImages;
