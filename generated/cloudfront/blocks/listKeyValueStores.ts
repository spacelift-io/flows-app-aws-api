import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  ListKeyValueStoresCommand,
} from "@aws-sdk/client-cloudfront";

const listKeyValueStores: AppBlock = {
  name: "List Key Value Stores",
  description: "Specifies the key value stores to list.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Marker: {
          name: "Marker",
          description: "The marker associated with the key value stores list.",
          type: "string",
          required: false,
        },
        MaxItems: {
          name: "Max Items",
          description:
            "The maximum number of items in the key value stores list.",
          type: "number",
          required: false,
        },
        Status: {
          name: "Status",
          description:
            "The status of the request for the key value stores list.",
          type: "string",
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
        });

        const command = new ListKeyValueStoresCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Key Value Stores Result",
      description: "Result from ListKeyValueStores operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          KeyValueStoreList: {
            type: "object",
            properties: {
              NextMarker: {
                type: "string",
              },
              MaxItems: {
                type: "number",
              },
              Quantity: {
                type: "number",
              },
              Items: {
                type: "array",
                items: {
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
                  required: [
                    "Name",
                    "Id",
                    "Comment",
                    "ARN",
                    "LastModifiedTime",
                  ],
                  additionalProperties: false,
                },
              },
            },
            required: ["MaxItems", "Quantity"],
            additionalProperties: false,
            description: "The resulting key value stores list.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listKeyValueStores;
