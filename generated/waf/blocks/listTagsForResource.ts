import { AppBlock, events } from "@slflows/sdk/v1";
import { WAFClient, ListTagsForResourceCommand } from "@aws-sdk/client-waf";

const listTagsForResource: AppBlock = {
  name: "List Tags For Resource",
  description: "This is AWS WAF Classic documentation.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        NextMarker: {
          name: "Next Marker",
          description: "",
          type: "string",
          required: false,
        },
        Limit: {
          name: "Limit",
          description: "",
          type: "number",
          required: false,
        },
        ResourceARN: {
          name: "Resource ARN",
          description: "",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new WAFClient({
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

        const command = new ListTagsForResourceCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Tags For Resource Result",
      description: "Result from ListTagsForResource operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NextMarker: {
            type: "string",
            description: "",
          },
          TagInfoForResource: {
            type: "object",
            properties: {
              ResourceARN: {
                type: "string",
              },
              TagList: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Key: {
                      type: "string",
                    },
                    Value: {
                      type: "string",
                    },
                  },
                  required: ["Key", "Value"],
                  additionalProperties: false,
                },
              },
            },
            additionalProperties: false,
            description: "",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listTagsForResource;
