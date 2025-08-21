import { AppBlock, events } from "@slflows/sdk/v1";
import { ECRClient, BatchDeleteImageCommand } from "@aws-sdk/client-ecr";

const batchDeleteImage: AppBlock = {
  name: "Batch Delete Image",
  description: "Deletes a list of specified images within a repository.",
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
            "The Amazon Web Services account ID associated with the registry that contains the image to delete.",
          type: "string",
          required: false,
        },
        repositoryName: {
          name: "repository Name",
          description: "The repository that contains the image to delete.",
          type: "string",
          required: true,
        },
        imageIds: {
          name: "image Ids",
          description:
            "A list of image ID references that correspond to images to delete.",
          type: {
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
          },
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

        const command = new BatchDeleteImageCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Batch Delete Image Result",
      description: "Result from BatchDeleteImage operation",
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
            description: "The image IDs of the deleted images.",
          },
          failures: {
            type: "array",
            items: {
              type: "object",
              properties: {
                imageId: {
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
                failureCode: {
                  type: "string",
                },
                failureReason: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "Any failures associated with the call.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default batchDeleteImage;
