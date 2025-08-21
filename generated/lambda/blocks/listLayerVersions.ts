import { AppBlock, events } from "@slflows/sdk/v1";
import { LambdaClient, ListLayerVersionsCommand } from "@aws-sdk/client-lambda";

const listLayerVersions: AppBlock = {
  name: "List Layer Versions",
  description: "Lists the versions of an Lambda layer.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        CompatibleRuntime: {
          name: "Compatible Runtime",
          description: "A runtime identifier.",
          type: "string",
          required: false,
        },
        LayerName: {
          name: "Layer Name",
          description: "The name or Amazon Resource Name (ARN) of the layer.",
          type: "string",
          required: true,
        },
        Marker: {
          name: "Marker",
          description: "A pagination token returned by a previous call.",
          type: "string",
          required: false,
        },
        MaxItems: {
          name: "Max Items",
          description: "The maximum number of versions to return.",
          type: "number",
          required: false,
        },
        CompatibleArchitecture: {
          name: "Compatible Architecture",
          description: "The compatible instruction set architecture.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new LambdaClient({
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

        const command = new ListLayerVersionsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Layer Versions Result",
      description: "Result from ListLayerVersions operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NextMarker: {
            type: "string",
            description:
              "A pagination token returned when the response doesn't contain all versions.",
          },
          LayerVersions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                LayerVersionArn: {
                  type: "string",
                },
                Version: {
                  type: "number",
                },
                Description: {
                  type: "string",
                },
                CreatedDate: {
                  type: "string",
                },
                CompatibleRuntimes: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                LicenseInfo: {
                  type: "string",
                },
                CompatibleArchitectures: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              additionalProperties: false,
            },
            description: "A list of versions.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listLayerVersions;
