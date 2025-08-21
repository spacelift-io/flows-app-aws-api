import { AppBlock, events } from "@slflows/sdk/v1";
import { LambdaClient, ListTagsCommand } from "@aws-sdk/client-lambda";

const listTags: AppBlock = {
  name: "List Tags",
  description:
    "Returns a function, event source mapping, or code signing configuration's tags.",
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

        const command = new ListTagsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Tags Result",
      description: "Result from ListTags operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Tags: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description: "The function's tags.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listTags;
