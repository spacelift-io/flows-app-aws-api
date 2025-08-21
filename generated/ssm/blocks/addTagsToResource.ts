import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, AddTagsToResourceCommand } from "@aws-sdk/client-ssm";

const addTagsToResource: AppBlock = {
  name: "Add Tags To Resource",
  description:
    "Adds or overwrites one or more tags for the specified resource.",
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
          description: "Specifies the type of resource you are tagging.",
          type: "string",
          required: true,
        },
        ResourceId: {
          name: "Resource Id",
          description: "The resource ID you want to tag.",
          type: "string",
          required: true,
        },
        Tags: {
          name: "Tags",
          description: "One or more tags.",
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
              required: ["Key", "Value"],
              additionalProperties: false,
            },
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new SSMClient({
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

        const command = new AddTagsToResourceCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Add Tags To Resource Result",
      description: "Result from AddTagsToResource operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default addTagsToResource;
