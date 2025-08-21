import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  UpdateKeyValueStoreCommand,
} from "@aws-sdk/client-cloudfront";

const updateKeyValueStore: AppBlock = {
  name: "Update Key Value Store",
  description: "Specifies the key value store to update.",
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
          description: "The name of the key value store to update.",
          type: "string",
          required: true,
        },
        Comment: {
          name: "Comment",
          description: "The comment of the key value store to update.",
          type: "string",
          required: true,
        },
        IfMatch: {
          name: "If Match",
          description: "The key value store to update, if a match occurs.",
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

        const command = new UpdateKeyValueStoreCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Key Value Store Result",
      description: "Result from UpdateKeyValueStore operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          KeyValueStore: {
            type: "object",
            properties: {
              Name: {
                type: "string",
              },
              Id: {
                type: "string",
              },
              Comment: {
                type: "string",
              },
              ARN: {
                type: "string",
              },
              Status: {
                type: "string",
              },
              LastModifiedTime: {
                type: "string",
              },
            },
            required: ["Name", "Id", "Comment", "ARN", "LastModifiedTime"],
            additionalProperties: false,
            description: "The resulting key value store to update.",
          },
          ETag: {
            type: "string",
            description: "The ETag of the resulting key value store.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateKeyValueStore;
