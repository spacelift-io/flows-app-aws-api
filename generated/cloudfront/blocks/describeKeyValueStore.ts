import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  DescribeKeyValueStoreCommand,
} from "@aws-sdk/client-cloudfront";

const describeKeyValueStore: AppBlock = {
  name: "Describe Key Value Store",
  description: "Specifies the key value store and its configuration.",
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
        });

        const command = new DescribeKeyValueStoreCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Key Value Store Result",
      description: "Result from DescribeKeyValueStore operation",
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
            description: "The ETag of the resulting key value store.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeKeyValueStore;
