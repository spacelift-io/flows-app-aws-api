import { AppBlock, events } from "@slflows/sdk/v1";
import {
  Route53Client,
  ListTagsForResourcesCommand,
} from "@aws-sdk/client-route-53";

const listTagsForResources: AppBlock = {
  name: "List Tags For Resources",
  description: "Lists tags for up to 10 health checks or hosted zones.",
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
          description: "The type of the resources.",
          type: "string",
          required: true,
        },
        ResourceIds: {
          name: "Resource Ids",
          description:
            "A complex type that contains the ResourceId element for each resource for which you want to get a list of tags.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: true,
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

        const command = new ListTagsForResourcesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Tags For Resources Result",
      description: "Result from ListTagsForResources operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ResourceTagSets: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ResourceType: {
                  type: "string",
                },
                ResourceId: {
                  type: "string",
                },
                Tags: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Key: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Value: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
              },
              additionalProperties: false,
            },
            description:
              "A list of ResourceTagSets containing tags associated with the specified resources.",
          },
        },
        required: ["ResourceTagSets"],
      },
    },
  },
};

export default listTagsForResources;
