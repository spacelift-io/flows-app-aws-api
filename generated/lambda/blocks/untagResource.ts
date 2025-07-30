import { AppBlock, events } from "@slflows/sdk/v1";
import { LambdaClient, UntagResourceCommand } from "@aws-sdk/client-lambda";

const untagResource: AppBlock = {
  name: "Untag Resource",
  description:
    "Removes tags from a function, event source mapping, or code signing configuration.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Resource: {
          name: "Resource",
          description: "The resource's Amazon Resource Name (ARN).",
          type: "string",
          required: true,
        },
        TagKeys: {
          name: "Tag Keys",
          description: "A list of tag keys to remove from the resource.",
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

        const client = new LambdaClient({
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
        additionalProperties: true,
      },
    },
  },
};

export default untagResource;
