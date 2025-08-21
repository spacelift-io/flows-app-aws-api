import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  ListPublicKeysCommand,
} from "@aws-sdk/client-cloudfront";

const listPublicKeys: AppBlock = {
  name: "List Public Keys",
  description:
    "List all public keys that have been added to CloudFront for this account.",
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
          description:
            "Use this when paginating results to indicate where to begin in your list of public keys.",
          type: "string",
          required: false,
        },
        MaxItems: {
          name: "Max Items",
          description:
            "The maximum number of public keys you want in the response body.",
          type: "number",
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

        const command = new ListPublicKeysCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Public Keys Result",
      description: "Result from ListPublicKeys operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          PublicKeyList: {
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
                    Id: {
                      type: "string",
                    },
                    Name: {
                      type: "string",
                    },
                    CreatedTime: {
                      type: "string",
                    },
                    EncodedKey: {
                      type: "string",
                    },
                    Comment: {
                      type: "string",
                    },
                  },
                  required: ["Id", "Name", "CreatedTime", "EncodedKey"],
                  additionalProperties: false,
                },
              },
            },
            required: ["MaxItems", "Quantity"],
            additionalProperties: false,
            description:
              "Returns a list of all public keys that have been added to CloudFront for this account.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listPublicKeys;
