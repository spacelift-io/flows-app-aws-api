import { AppBlock, events } from "@slflows/sdk/v1";
import {
  Route53Client,
  ListTagsForResourceCommand,
} from "@aws-sdk/client-route-53";

const listTagsForResource: AppBlock = {
  name: "List Tags For Resource",
  description: "Lists tags for one health check or hosted zone.",
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
            "The ID of the resource for which you want to retrieve tags.",
          type: "string",
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
          ResourceTagSet: {
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
                      type: "string",
                    },
                    Value: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
            },
            additionalProperties: false,
            description:
              "A ResourceTagSet containing tags associated with the specified resource.",
          },
        },
        required: ["ResourceTagSet"],
      },
    },
  },
};

export default listTagsForResource;
