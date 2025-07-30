import { AppBlock, events } from "@slflows/sdk/v1";
import { ECRClient, PutImageCommand } from "@aws-sdk/client-ecr";

const putImage: AppBlock = {
  name: "Put Image",
  description:
    "Creates or updates the image manifest and tags associated with an image.",
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
            "The Amazon Web Services account ID associated with the registry that contains the repository in which to put the image.",
          type: "string",
          required: false,
        },
        repositoryName: {
          name: "repository Name",
          description: "The name of the repository in which to put the image.",
          type: "string",
          required: true,
        },
        imageManifest: {
          name: "image Manifest",
          description:
            "The image manifest corresponding to the image to be uploaded.",
          type: "string",
          required: true,
        },
        imageManifestMediaType: {
          name: "image Manifest Media Type",
          description: "The media type of the image manifest.",
          type: "string",
          required: false,
        },
        imageTag: {
          name: "image Tag",
          description: "The tag to associate with the image.",
          type: "string",
          required: false,
        },
        imageDigest: {
          name: "image Digest",
          description:
            "The image digest of the image manifest corresponding to the image.",
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
        });

        const command = new PutImageCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Image Result",
      description: "Result from PutImage operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          image: {
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
            description: "Details of the image uploaded.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default putImage;
