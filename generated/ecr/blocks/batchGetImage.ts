import { AppBlock, events } from "@slflows/sdk/v1";
import { ECRClient, BatchGetImageCommand } from "@aws-sdk/client-ecr";

const batchGetImage: AppBlock = {
  name: "Batch Get Image",
  description: "Gets detailed information for an image.",
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
            "The Amazon Web Services account ID associated with the registry that contains the images to describe.",
          type: "string",
          required: false,
        },
        repositoryName: {
          name: "repository Name",
          description: "The repository that contains the images to describe.",
          type: "string",
          required: true,
        },
        imageIds: {
          name: "image Ids",
          description:
            "A list of image ID references that correspond to images to describe.",
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
        acceptedMediaTypes: {
          name: "accepted Media Types",
          description: "The accepted media types for the request.",
          type: {
            type: "array",
            items: {
              type: "string",
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
        });

        const command = new BatchGetImageCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Batch Get Image Result",
      description: "Result from BatchGetImage operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          images: {
            type: "array",
            items: {
              type: "object",
              properties: {
                registryId: {
                  type: "string",
                },
                repositoryName: {
                  type: "string",
                },
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
                imageManifest: {
                  type: "string",
                },
                imageManifestMediaType: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "A list of image objects corresponding to the image references in the request.",
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

export default batchGetImage;
