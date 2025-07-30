import { AppBlock, events } from "@slflows/sdk/v1";
import { EKSClient, UntagResourceCommand } from "@aws-sdk/client-eks";

const untagResource: AppBlock = {
  name: "Untag Resource",
  description: "Deletes specified tags from an Amazon EKS resource.",
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
            "The Amazon Resource Name (ARN) of the resource to delete tags from.",
          type: "string",
          required: true,
        },
        tagKeys: {
          name: "tag Keys",
          description: "The keys of the tags to remove.",
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

        const client = new EKSClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new UntagResourceCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Untag Resource Result",
      description: "Result from UntagResource operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default untagResource;
