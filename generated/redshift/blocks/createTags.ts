import { AppBlock, events } from "@slflows/sdk/v1";
import { RedshiftClient, CreateTagsCommand } from "@aws-sdk/client-redshift";

const createTags: AppBlock = {
  name: "Create Tags",
  description: `Adds tags to a cluster.`,
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
            "The Amazon Resource Name (ARN) to which you want to add the tag or tags.",
          type: "string",
          required: true,
        },
        Tags: {
          name: "Tags",
          description:
            "One or more name/value pairs to add as tags to the specified resource.",
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

        const client = new RedshiftClient({
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
