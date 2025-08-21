import { AppBlock, events } from "@slflows/sdk/v1";
import { KMSClient, GetKeyRotationStatusCommand } from "@aws-sdk/client-kms";

const getKeyRotationStatus: AppBlock = {
  name: "Get Key Rotation Status",
  description:
    "Provides detailed information about the rotation status for a KMS key, including whether automatic rotation of the key material is enabled for the specified KMS key, the rotation period, and the next scheduled rotation date.",
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
          description: "Gets the rotation status for the specified KMS key.",
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

        const command = new GetKeyRotationStatusCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Key Rotation Status Result",
      description: "Result from GetKeyRotationStatus operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          KeyRotationEnabled: {
            type: "boolean",
            description:
              "A Boolean value that specifies whether key rotation is enabled.",
          },
          KeyId: {
            type: "string",
            description:
              "Identifies the specified symmetric encryption KMS key.",
          },
          RotationPeriodInDays: {
            type: "number",
            description: "The number of days between each automatic rotation.",
          },
          NextRotationDate: {
            type: "string",
            description:
              "The next date that KMS will automatically rotate the key material.",
          },
          OnDemandRotationStartDate: {
            type: "string",
            description:
              "Identifies the date and time that an in progress on-demand rotation was initiated.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getKeyRotationStatus;
