import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  DeleteKeyValueStoreCommand,
} from "@aws-sdk/client-cloudfront";

const deleteKeyValueStore: AppBlock = {
  name: "Delete Key Value Store",
  description: "Specifies the key value store to delete.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Name: {
          name: "Name",
          description: "The name of the key value store.",
          type: "string",
          required: true,
        },
        IfMatch: {
          name: "If Match",
          description: "The key value store to delete, if a match occurs.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudFrontClient({
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

        const command = new DeleteKeyValueStoreCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Key Value Store Result",
      description: "Result from DeleteKeyValueStore operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteKeyValueStore;
