import { AppBlock, events } from "@slflows/sdk/v1";
import { ECRClient, UploadLayerPartCommand } from "@aws-sdk/client-ecr";

const uploadLayerPart: AppBlock = {
  name: "Upload Layer Part",
  description: "Uploads an image layer part to Amazon ECR.",
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
            "The Amazon Web Services account ID associated with the registry to which you are uploading layer parts.",
          type: "string",
          required: false,
        },
        repositoryName: {
          name: "repository Name",
          description:
            "The name of the repository to which you are uploading layer parts.",
          type: "string",
          required: true,
        },
        uploadId: {
          name: "upload Id",
          description:
            "The upload ID from a previous InitiateLayerUpload operation to associate with the layer part upload.",
          type: "string",
          required: true,
        },
        partFirstByte: {
          name: "part First Byte",
          description:
            "The position of the first byte of the layer part witin the overall image layer.",
          type: "number",
          required: true,
        },
        partLastByte: {
          name: "part Last Byte",
          description:
            "The position of the last byte of the layer part within the overall image layer.",
          type: "number",
          required: true,
        },
        layerPartBlob: {
          name: "layer Part Blob",
          description: "The base64-encoded layer part payload.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new UploadLayerPartCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Upload Layer Part Result",
      description: "Result from UploadLayerPart operation",
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
            description: "The upload ID associated with the request.",
          },
          lastByteReceived: {
            type: "number",
            description:
              "The integer value of the last byte received in the request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default uploadLayerPart;
