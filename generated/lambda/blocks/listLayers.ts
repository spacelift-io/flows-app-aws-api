import { AppBlock, events } from "@slflows/sdk/v1";
import { LambdaClient, ListLayersCommand } from "@aws-sdk/client-lambda";

const listLayers: AppBlock = {
  name: "List Layers",
  description:
    "Lists Lambda layers and shows information about the latest version of each.",
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
        Marker: {
          name: "Marker",
          description: "A pagination token returned by a previous call.",
          type: "string",
          required: false,
        },
        MaxItems: {
          name: "Max Items",
          description: "The maximum number of layers to return.",
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
        });

        const command = new ListLayersCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Layers Result",
      description: "Result from ListLayers operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NextMarker: {
            type: "string",
            description:
              "A pagination token returned when the response doesn't contain all layers.",
          },
          Layers: {
            type: "array",
            items: {
              type: "object",
              properties: {
                LayerName: {
                  type: "string",
                },
                LayerArn: {
                  type: "string",
                },
                LatestMatchingVersion: {
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
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    LicenseInfo: {
                      type: "string",
                    },
                    CompatibleArchitectures: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                  },
                  additionalProperties: false,
                },
              },
              additionalProperties: false,
            },
            description: "A list of function layers.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listLayers;
