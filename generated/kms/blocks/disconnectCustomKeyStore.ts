import { AppBlock, events } from "@slflows/sdk/v1";
import {
  KMSClient,
  DisconnectCustomKeyStoreCommand,
} from "@aws-sdk/client-kms";

const disconnectCustomKeyStore: AppBlock = {
  name: "Disconnect Custom Key Store",
  description: "Disconnects the custom key store from its backing key store.",
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
            "Enter the ID of the custom key store you want to disconnect.",
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
        });

        const command = new DisconnectCustomKeyStoreCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Disconnect Custom Key Store Result",
      description: "Result from DisconnectCustomKeyStore operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default disconnectCustomKeyStore;
