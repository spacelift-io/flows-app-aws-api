import { AppBlock, events } from "@slflows/sdk/v1";
import {
  DynamoDBClient,
  ListTagsOfResourceCommand,
} from "@aws-sdk/client-dynamodb";

const listTagsOfResource: AppBlock = {
  name: "List Tags Of Resource",
  description: "List all tags on an Amazon DynamoDB resource.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ResourceArn: {
          name: "Resource Arn",
          description: "The Amazon DynamoDB resource with tags to be listed.",
          type: "string",
          required: true,
        },
        NextToken: {
          name: "Next Token",
          description:
            "An optional string that, if supplied, must be copied from the output of a previous call to ListTagOfResource.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new DynamoDBClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new ListTagsOfResourceCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Tags Of Resource Result",
      description: "Result from ListTagsOfResource operation",
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
              "The tags currently associated with the Amazon DynamoDB resource.",
          },
          NextToken: {
            type: "string",
            description:
              "If this value is returned, there are additional results to be displayed.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listTagsOfResource;
