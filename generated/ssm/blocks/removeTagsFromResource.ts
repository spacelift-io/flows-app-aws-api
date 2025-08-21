import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, RemoveTagsFromResourceCommand } from "@aws-sdk/client-ssm";

const removeTagsFromResource: AppBlock = {
  name: "Remove Tags From Resource",
  description: "Removes tag keys from the specified resource.",
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
          description:
            "The type of resource from which you want to remove a tag.",
          type: "string",
          required: true,
        },
        ResourceId: {
          name: "Resource Id",
          description:
            "The ID of the resource from which you want to remove tags.",
          type: "string",
          required: true,
        },
        TagKeys: {
          name: "Tag Keys",
          description:
            "Tag keys that you want to remove from the specified resource.",
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
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default removeTagsFromResource;
