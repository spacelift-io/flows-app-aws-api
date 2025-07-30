import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, AddTagsToResourceCommand } from "@aws-sdk/client-rds";

const addTagsToResource: AppBlock = {
  name: "Add Tags To Resource",
  description: "Adds metadata tags to an Amazon RDS resource.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ResourceName: {
          name: "Resource Name",
          description: "The Amazon RDS resource that the tags are added to.",
          type: "string",
          required: true,
        },
        Tags: {
          name: "Tags",
          description: "The tags to be assigned to the Amazon RDS resource.",
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

        const client = new RDSClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
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
        additionalProperties: true,
      },
    },
  },
};

export default addTagsToResource;
