import { AppBlock, events } from "@slflows/sdk/v1";
import { KMSClient, ConnectCustomKeyStoreCommand } from "@aws-sdk/client-kms";

const connectCustomKeyStore: AppBlock = {
  name: "Connect Custom Key Store",
  description:
    "Connects or reconnects a custom key store to its backing key store.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        CustomKeyStoreId: {
          name: "Custom Key Store Id",
          description:
            "Enter the key store ID of the custom key store that you want to connect.",
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

        const command = new ConnectCustomKeyStoreCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Connect Custom Key Store Result",
      description: "Result from ConnectCustomKeyStore operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default connectCustomKeyStore;
