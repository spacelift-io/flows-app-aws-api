import { AppBlock, events } from "@slflows/sdk/v1";
import { ECRClient, GetDownloadUrlForLayerCommand } from "@aws-sdk/client-ecr";

const getDownloadUrlForLayer: AppBlock = {
  name: "Get Download Url For Layer",
  description:
    "Retrieves the pre-signed Amazon S3 download URL corresponding to an image layer.",
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
            "The Amazon Web Services account ID associated with the registry that contains the image layer to download.",
          type: "string",
          required: false,
        },
        repositoryName: {
          name: "repository Name",
          description:
            "The name of the repository that is associated with the image layer to download.",
          type: "string",
          required: true,
        },
        layerDigest: {
          name: "layer Digest",
          description: "The digest of the image layer to download.",
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
        });

        const command = new GetDownloadUrlForLayerCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Download Url For Layer Result",
      description: "Result from GetDownloadUrlForLayer operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          downloadUrl: {
            type: "string",
            description:
              "The pre-signed Amazon S3 download URL for the requested layer.",
          },
          layerDigest: {
            type: "string",
            description: "The digest of the image layer to download.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getDownloadUrlForLayer;
