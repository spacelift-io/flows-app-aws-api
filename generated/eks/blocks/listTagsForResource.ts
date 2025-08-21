import { AppBlock, events } from "@slflows/sdk/v1";
import { EKSClient, ListTagsForResourceCommand } from "@aws-sdk/client-eks";

const listTagsForResource: AppBlock = {
  name: "List Tags For Resource",
  description: "List the tags for an Amazon EKS resource.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        resourceArn: {
          name: "resource Arn",
          description:
            "The Amazon Resource Name (ARN) that identifies the resource to list tags for.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new EKSClient({
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
          tags: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description: "The tags for the resource.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listTagsForResource;
