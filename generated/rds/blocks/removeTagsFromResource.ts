import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, RemoveTagsFromResourceCommand } from "@aws-sdk/client-rds";

const removeTagsFromResource: AppBlock = {
  name: "Remove Tags From Resource",
  description: "Removes metadata tags from an Amazon RDS resource.",
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
          description:
            "The Amazon RDS resource that the tags are removed from.",
          type: "string",
          required: true,
        },
        TagKeys: {
          name: "Tag Keys",
          description: "The tag key (name) of the tag to be removed.",
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

        const client = new RDSClient({
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

        const command = new RemoveTagsFromResourceCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Remove Tags From Resource Result",
      description: "Result from RemoveTagsFromResource operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default removeTagsFromResource;
