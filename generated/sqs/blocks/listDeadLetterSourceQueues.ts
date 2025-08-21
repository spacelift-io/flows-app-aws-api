import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SQSClient,
  ListDeadLetterSourceQueuesCommand,
} from "@aws-sdk/client-sqs";

const listDeadLetterSourceQueues: AppBlock = {
  name: "List Dead Letter Source Queues",
  description:
    "Returns a list of your queues that have the RedrivePolicy queue attribute configured with a dead-letter queue.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        QueueUrl: {
          name: "Queue Url",
          description: "The URL of a dead-letter queue.",
          type: "string",
          required: true,
        },
        NextToken: {
          name: "Next Token",
          description: "Pagination token to request the next set of results.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description: "Maximum number of results to include in the response.",
          type: "number",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new SQSClient({
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

        const command = new ListDeadLetterSourceQueuesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Dead Letter Source Queues Result",
      description: "Result from ListDeadLetterSourceQueues operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          queueUrls: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "A list of source queue URLs that have the RedrivePolicy queue attribute configured with a dead-letter queue.",
          },
          NextToken: {
            type: "string",
            description: "Pagination token to include in the next request.",
          },
        },
        required: ["queueUrls"],
      },
    },
  },
};

export default listDeadLetterSourceQueues;
