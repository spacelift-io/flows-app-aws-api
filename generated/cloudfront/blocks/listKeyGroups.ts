import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  ListKeyGroupsCommand,
} from "@aws-sdk/client-cloudfront";

const listKeyGroups: AppBlock = {
  name: "List Key Groups",
  description: "Gets a list of key groups.",
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
            "Use this field when paginating results to indicate where to begin in your list of key groups.",
          type: "string",
          required: false,
        },
        MaxItems: {
          name: "Max Items",
          description:
            "The maximum number of key groups that you want in the response.",
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

        const command = new ListKeyGroupsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Key Groups Result",
      description: "Result from ListKeyGroups operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          KeyGroupList: {
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
                    KeyGroup: {
                      type: "object",
                      properties: {
                        Id: {
                          type: "object",
                          additionalProperties: true,
                        },
                        LastModifiedTime: {
                          type: "object",
                          additionalProperties: true,
                        },
                        KeyGroupConfig: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["Id", "LastModifiedTime", "KeyGroupConfig"],
                      additionalProperties: false,
                    },
                  },
                  required: ["KeyGroup"],
                  additionalProperties: false,
                },
              },
            },
            required: ["MaxItems", "Quantity"],
            additionalProperties: false,
            description: "A list of key groups.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listKeyGroups;
