import { AppBlock, events } from "@slflows/sdk/v1";
import { ECRClient, InitiateLayerUploadCommand } from "@aws-sdk/client-ecr";

const initiateLayerUpload: AppBlock = {
  name: "Initiate Layer Upload",
  description: "Notifies Amazon ECR that you intend to upload an image layer.",
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
            "The Amazon Web Services account ID associated with the registry to which you intend to upload layers.",
          type: "string",
          required: false,
        },
        repositoryName: {
          name: "repository Name",
          description:
            "The name of the repository to which you intend to upload layers.",
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

        const command = new InitiateLayerUploadCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Initiate Layer Upload Result",
      description: "Result from InitiateLayerUpload operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          uploadId: {
            type: "string",
            description: "The upload ID for the layer upload.",
          },
          partSize: {
            type: "number",
            description:
              "The size, in bytes, that Amazon ECR expects future layer part uploads to be.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default initiateLayerUpload;
