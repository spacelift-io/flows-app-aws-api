import { AppBlock, events } from "@slflows/sdk/v1";
import {
  ECRClient,
  BatchCheckLayerAvailabilityCommand,
} from "@aws-sdk/client-ecr";

const batchCheckLayerAvailability: AppBlock = {
  name: "Batch Check Layer Availability",
  description:
    "Checks the availability of one or more image layers in a repository.",
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
            "The Amazon Web Services account ID associated with the registry that contains the image layers to check.",
          type: "string",
          required: false,
        },
        repositoryName: {
          name: "repository Name",
          description:
            "The name of the repository that is associated with the image layers to check.",
          type: "string",
          required: true,
        },
        layerDigests: {
          name: "layer Digests",
          description: "The digests of the image layers to check.",
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
        });

        const command = new BatchCheckLayerAvailabilityCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Batch Check Layer Availability Result",
      description: "Result from BatchCheckLayerAvailability operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          layers: {
            type: "array",
            items: {
              type: "object",
              properties: {
                layerDigest: {
                  type: "string",
                },
                layerAvailability: {
                  type: "string",
                },
                layerSize: {
                  type: "number",
                },
                mediaType: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "A list of image layer objects corresponding to the image layer references in the request.",
          },
          failures: {
            type: "array",
            items: {
              type: "object",
              properties: {
                layerDigest: {
                  type: "string",
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

export default batchCheckLayerAvailability;
