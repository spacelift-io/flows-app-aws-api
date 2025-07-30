import { AppBlock, events } from "@slflows/sdk/v1";
import { KMSClient, EnableKeyRotationCommand } from "@aws-sdk/client-kms";

const enableKeyRotation: AppBlock = {
  name: "Enable Key Rotation",
  description:
    "Enables automatic rotation of the key material of the specified symmetric encryption KMS key.",
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
        RotationPeriodInDays: {
          name: "Rotation Period In Days",
          description:
            "Use this parameter to specify a custom period of time between each rotation date.",
          type: "number",
          required: false,
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
        });

        const command = new EnableKeyRotationCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Enable Key Rotation Result",
      description: "Result from EnableKeyRotation operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default enableKeyRotation;
