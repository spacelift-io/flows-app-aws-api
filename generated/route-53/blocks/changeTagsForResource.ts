import { AppBlock, events } from "@slflows/sdk/v1";
import {
  Route53Client,
  ChangeTagsForResourceCommand,
} from "@aws-sdk/client-route-53";

const changeTagsForResource: AppBlock = {
  name: "Change Tags For Resource",
  description:
    "Adds, edits, or deletes tags for a health check or a hosted zone.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ResourceType: {
          name: "Resource Type",
          description: "The type of the resource.",
          type: "string",
          required: true,
        },
        ResourceId: {
          name: "Resource Id",
          description:
            "The ID of the resource for which you want to add, change, or delete tags.",
          type: "string",
          required: true,
        },
        AddTags: {
          name: "Add Tags",
          description:
            "A complex type that contains a list of the tags that you want to add to the specified health check or hosted zone and/or the tags that you want to edit Value for.",
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
              additionalProperties: false,
            },
          },
          required: false,
        },
        RemoveTagKeys: {
          name: "Remove Tag Keys",
          description:
            "A complex type that contains a list of the tags that you want to delete from the specified health check or hosted zone.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new Route53Client({
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

        const command = new ChangeTagsForResourceCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Change Tags For Resource Result",
      description: "Result from ChangeTagsForResource operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default changeTagsForResource;
