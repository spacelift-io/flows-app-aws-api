import { AppBlock, events } from "@slflows/sdk/v1";
import { LambdaClient, GetLayerVersionCommand } from "@aws-sdk/client-lambda";

const getLayerVersion: AppBlock = {
  name: "Get Layer Version",
  description:
    "Returns information about a version of an Lambda layer, with a link to download the layer archive that's valid for 10 minutes.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        LayerName: {
          name: "Layer Name",
          description: "The name or Amazon Resource Name (ARN) of the layer.",
          type: "string",
          required: true,
        },
        VersionNumber: {
          name: "Version Number",
          description: "The version number.",
          type: "number",
          required: true,
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

        const command = new GetLayerVersionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Layer Version Result",
      description: "Result from GetLayerVersion operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Content: {
            type: "object",
            properties: {
              Location: {
                type: "string",
              },
              CodeSha256: {
                type: "string",
              },
              CodeSize: {
                type: "number",
              },
              SigningProfileVersionArn: {
                type: "string",
              },
              SigningJobArn: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "Details about the layer version.",
          },
          LayerArn: {
            type: "string",
            description: "The ARN of the layer.",
          },
          LayerVersionArn: {
            type: "string",
            description: "The ARN of the layer version.",
          },
          Description: {
            type: "string",
            description: "The description of the version.",
          },
          CreatedDate: {
            type: "string",
            description:
              "The date that the layer version was created, in ISO-8601 format (YYYY-MM-DDThh:mm:ss.",
          },
          Version: {
            type: "number",
            description: "The version number.",
          },
          CompatibleRuntimes: {
            type: "array",
            items: {
              type: "string",
            },
            description: "The layer's compatible runtimes.",
          },
          LicenseInfo: {
            type: "string",
            description: "The layer's software license.",
          },
          CompatibleArchitectures: {
            type: "array",
            items: {
              type: "string",
            },
            description: "A list of compatible instruction set architectures.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getLayerVersion;
