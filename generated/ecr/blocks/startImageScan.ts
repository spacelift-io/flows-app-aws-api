import { AppBlock, events } from "@slflows/sdk/v1";
import { ECRClient, StartImageScanCommand } from "@aws-sdk/client-ecr";

const startImageScan: AppBlock = {
  name: "Start Image Scan",
  description: "Starts a basic image vulnerability scan.",
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
            "The Amazon Web Services account ID associated with the registry that contains the repository in which to start an image scan request.",
          type: "string",
          required: false,
        },
        repositoryName: {
          name: "repository Name",
          description:
            "The name of the repository that contains the images to scan.",
          type: "string",
          required: true,
        },
        imageId: {
          name: "image Id",
          description:
            "An object with identifying information for an image in an Amazon ECR repository.",
          type: {
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

        const command = new StartImageScanCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Start Image Scan Result",
      description: "Result from StartImageScan operation",
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
            description:
              "An object with identifying information for an image in an Amazon ECR repository.",
          },
          imageScanStatus: {
            type: "object",
            properties: {
              status: {
                type: "string",
              },
              description: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "The current state of the scan.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default startImageScan;
