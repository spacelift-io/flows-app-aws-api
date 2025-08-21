import { AppBlock, events } from "@slflows/sdk/v1";
import { ECRClient, CompleteLayerUploadCommand } from "@aws-sdk/client-ecr";

const completeLayerUpload: AppBlock = {
  name: "Complete Layer Upload",
  description:
    "Informs Amazon ECR that the image layer upload has completed for a specified registry, repository name, and upload ID.",
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
            "The Amazon Web Services account ID associated with the registry to which to upload layers.",
          type: "string",
          required: false,
        },
        repositoryName: {
          name: "repository Name",
          description:
            "The name of the repository to associate with the image layer.",
          type: "string",
          required: true,
        },
        uploadId: {
          name: "upload Id",
          description:
            "The upload ID from a previous InitiateLayerUpload operation to associate with the image layer.",
          type: "string",
          required: true,
        },
        layerDigests: {
          name: "layer Digests",
          description: "The sha256 digest of the image layer.",
          type: {
            type: "array",
            items: {
              type: "string",
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

        const command = new CompleteLayerUploadCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Complete Layer Upload Result",
      description: "Result from CompleteLayerUpload operation",
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
          uploadId: {
            type: "string",
            description: "The upload ID associated with the layer.",
          },
          layerDigest: {
            type: "string",
            description: "The sha256 digest of the image layer.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default completeLayerUpload;
