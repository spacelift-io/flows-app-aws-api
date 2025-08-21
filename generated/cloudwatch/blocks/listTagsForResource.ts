import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudWatchClient,
  ListTagsForResourceCommand,
} from "@aws-sdk/client-cloudwatch";

const listTagsForResource: AppBlock = {
  name: "List Tags For Resource",
  description: "Displays the tags associated with a CloudWatch resource.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ResourceARN: {
          name: "Resource ARN",
          description:
            "The ARN of the CloudWatch resource that you want to view tags for.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudWatchClient({
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
          Tags: {
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
              required: ["Key", "Value"],
              additionalProperties: false,
            },
            description:
              "The list of tag keys and values associated with the resource you specified.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listTagsForResource;
