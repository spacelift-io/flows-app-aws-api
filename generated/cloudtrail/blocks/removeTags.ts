import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudTrailClient,
  RemoveTagsCommand,
} from "@aws-sdk/client-cloudtrail";

const removeTags: AppBlock = {
  name: "Remove Tags",
  description:
    "Removes the specified tags from a trail, event data store, dashboard, or channel.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ResourceId: {
          name: "Resource Id",
          description:
            "Specifies the ARN of the trail, event data store, dashboard, or channel from which tags should be removed.",
          type: "string",
          required: true,
        },
        TagsList: {
          name: "Tags List",
          description: "Specifies a list of tags to be removed.",
          type: {
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
              required: ["Key"],
              additionalProperties: false,
            },
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudTrailClient({
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

        const command = new RemoveTagsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Remove Tags Result",
      description: "Result from RemoveTags operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default removeTags;
