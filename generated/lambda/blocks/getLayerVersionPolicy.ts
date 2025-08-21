import { AppBlock, events } from "@slflows/sdk/v1";
import {
  LambdaClient,
  GetLayerVersionPolicyCommand,
} from "@aws-sdk/client-lambda";

const getLayerVersionPolicy: AppBlock = {
  name: "Get Layer Version Policy",
  description:
    "Returns the permission policy for a version of an Lambda layer.",
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

        const command = new GetLayerVersionPolicyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Layer Version Policy Result",
      description: "Result from GetLayerVersionPolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Policy: {
            type: "string",
            description: "The policy document.",
          },
          RevisionId: {
            type: "string",
            description:
              "A unique identifier for the current revision of the policy.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getLayerVersionPolicy;
