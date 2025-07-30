import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, CreateTagsCommand } from "@aws-sdk/client-ec2";

const createTags: AppBlock = {
  name: "Create Tags",
  description:
    "Adds or overwrites only the specified tags for the specified Amazon EC2 resource or resources.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the action, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
        },
        Resources: {
          name: "Resources",
          description: "The IDs of the resources, separated by spaces.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: true,
        },
        Tags: {
          name: "Tags",
          description: "The tags.",
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
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new EC2Client({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new CreateTagsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Tags Result",
      description: "Result from CreateTags operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default createTags;
