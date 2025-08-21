import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  CreateKeyValueStoreCommand,
} from "@aws-sdk/client-cloudfront";

const createKeyValueStore: AppBlock = {
  name: "Create Key Value Store",
  description: "Specifies the key value store resource to add to your account.",
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
        Comment: {
          name: "Comment",
          description: "The comment of the key value store.",
          type: "string",
          required: false,
        },
        ImportSource: {
          name: "Import Source",
          description: "The S3 bucket that provides the source for the import.",
          type: {
            type: "object",
            properties: {
              SourceType: {
                type: "string",
              },
              SourceARN: {
                type: "string",
              },
            },
            required: ["SourceType", "SourceARN"],
            additionalProperties: false,
          },
          required: false,
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

        const command = new CreateKeyValueStoreCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Key Value Store Result",
      description: "Result from CreateKeyValueStore operation",
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
            description: "The resulting key value store.",
          },
          ETag: {
            type: "string",
            description: "The ETag in the resulting key value store.",
          },
          Location: {
            type: "string",
            description: "The location of the resulting key value store.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createKeyValueStore;
