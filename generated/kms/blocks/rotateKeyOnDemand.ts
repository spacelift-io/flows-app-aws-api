import { AppBlock, events } from "@slflows/sdk/v1";
import { KMSClient, RotateKeyOnDemandCommand } from "@aws-sdk/client-kms";

const rotateKeyOnDemand: AppBlock = {
  name: "Rotate Key On Demand",
  description:
    "Immediately initiates rotation of the key material of the specified symmetric encryption KMS key.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        KeyId: {
          name: "Key Id",
          description: "Identifies a symmetric encryption KMS key.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new KMSClient({
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

        const command = new RotateKeyOnDemandCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Rotate Key On Demand Result",
      description: "Result from RotateKeyOnDemand operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          KeyId: {
            type: "string",
            description:
              "Identifies the symmetric encryption KMS key that you initiated on-demand rotation on.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default rotateKeyOnDemand;
