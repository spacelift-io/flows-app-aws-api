import { AppBlock, events } from "@slflows/sdk/v1";
import { CloudTrailClient, AddTagsCommand } from "@aws-sdk/client-cloudtrail";

const addTags: AppBlock = {
  name: "Add Tags",
  description:
    "Adds one or more tags to a trail, event data store, dashboard, or channel, up to a limit of 50.",
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
            "Specifies the ARN of the trail, event data store, dashboard, or channel to which one or more tags will be added.",
          type: "string",
          required: true,
        },
        TagsList: {
          name: "Tags List",
          description: "Contains a list of tags, up to a limit of 50",
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

        const command = new AddTagsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Add Tags Result",
      description: "Result from AddTags operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default addTags;
