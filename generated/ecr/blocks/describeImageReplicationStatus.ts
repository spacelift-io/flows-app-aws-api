import { AppBlock, events } from "@slflows/sdk/v1";
import {
  ECRClient,
  DescribeImageReplicationStatusCommand,
} from "@aws-sdk/client-ecr";

const describeImageReplicationStatus: AppBlock = {
  name: "Describe Image Replication Status",
  description: "Returns the replication status for a specified image.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        repositoryName: {
          name: "repository Name",
          description: "The name of the repository that the image is in.",
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
        registryId: {
          name: "registry Id",
          description:
            "The Amazon Web Services account ID associated with the registry.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new DescribeImageReplicationStatusCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Image Replication Status Result",
      description: "Result from DescribeImageReplicationStatus operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
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
          replicationStatuses: {
            type: "array",
            items: {
              type: "object",
              properties: {
                region: {
                  type: "string",
                },
                registryId: {
                  type: "string",
                },
                status: {
                  type: "string",
                },
                failureCode: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "The replication status details for the images in the specified repository.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeImageReplicationStatus;
