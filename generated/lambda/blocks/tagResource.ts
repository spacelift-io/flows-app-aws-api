import { AppBlock, events } from "@slflows/sdk/v1";
import { LambdaClient, TagResourceCommand } from "@aws-sdk/client-lambda";

const tagResource: AppBlock = {
  name: "Tag Resource",
  description:
    "Adds tags to a function, event source mapping, or code signing configuration.",
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
        Tags: {
          name: "Tags",
          description: "A list of tags to apply to the resource.",
          type: {
            type: "object",
            additionalProperties: {
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new TagResourceCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Tag Resource Result",
      description: "Result from TagResource operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default tagResource;
