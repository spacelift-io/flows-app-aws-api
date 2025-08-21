import { AppBlock, events } from "@slflows/sdk/v1";
import { KMSClient, ListResourceTagsCommand } from "@aws-sdk/client-kms";

const listResourceTags: AppBlock = {
  name: "List Resource Tags",
  description: "Returns all tags on the specified KMS key.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        KeyId: {
          name: "Key Id",
          description: "Gets tags on the specified KMS key.",
          type: "string",
          required: true,
        },
        Limit: {
          name: "Limit",
          description:
            "Use this parameter to specify the maximum number of items to return.",
          type: "number",
          required: false,
        },
        Marker: {
          name: "Marker",
          description:
            "Use this parameter in a subsequent request after you receive a response with truncated results.",
          type: "string",
          required: false,
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

        const command = new ListResourceTagsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Resource Tags Result",
      description: "Result from ListResourceTags operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Tags: {
            type: "array",
            items: {
              type: "object",
              properties: {
                TagKey: {
                  type: "string",
                },
                TagValue: {
                  type: "string",
                },
              },
              required: ["TagKey", "TagValue"],
              additionalProperties: false,
            },
            description: "A list of tags.",
          },
          NextMarker: {
            type: "string",
            description:
              "When Truncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent request.",
          },
          Truncated: {
            type: "boolean",
            description:
              "A flag that indicates whether there are more items in the list.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listResourceTags;
