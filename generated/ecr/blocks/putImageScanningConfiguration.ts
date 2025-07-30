import { AppBlock, events } from "@slflows/sdk/v1";
import {
  ECRClient,
  PutImageScanningConfigurationCommand,
} from "@aws-sdk/client-ecr";

const putImageScanningConfiguration: AppBlock = {
  name: "Put Image Scanning Configuration",
  description:
    "The PutImageScanningConfiguration API is being deprecated, in favor of specifying the image scanning configuration at the registry level.",
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
            "The Amazon Web Services account ID associated with the registry that contains the repository in which to update the image scanning configuration setting.",
          type: "string",
          required: false,
        },
        repositoryName: {
          name: "repository Name",
          description:
            "The name of the repository in which to update the image scanning configuration setting.",
          type: "string",
          required: true,
        },
        imageScanningConfiguration: {
          name: "image Scanning Configuration",
          description: "The image scanning configuration for the repository.",
          type: {
            type: "object",
            properties: {
              scanOnPush: {
                type: "boolean",
              },
            },
            additionalProperties: false,
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
        });

        const command = new PutImageScanningConfigurationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Image Scanning Configuration Result",
      description: "Result from PutImageScanningConfiguration operation",
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
          imageScanningConfiguration: {
            type: "object",
            properties: {
              scanOnPush: {
                type: "boolean",
              },
            },
            additionalProperties: false,
            description:
              "The image scanning configuration setting for the repository.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default putImageScanningConfiguration;
