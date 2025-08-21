import { AppBlock, events } from "@slflows/sdk/v1";
import {
  LambdaClient,
  DeleteLayerVersionCommand,
} from "@aws-sdk/client-lambda";

const deleteLayerVersion: AppBlock = {
  name: "Delete Layer Version",
  description: "Deletes a version of an Lambda layer.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new DeleteLayerVersionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Layer Version Result",
      description: "Result from DeleteLayerVersion operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteLayerVersion;
