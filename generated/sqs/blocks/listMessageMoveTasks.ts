import { AppBlock, events } from "@slflows/sdk/v1";
import { SQSClient, ListMessageMoveTasksCommand } from "@aws-sdk/client-sqs";

const listMessageMoveTasks: AppBlock = {
  name: "List Message Move Tasks",
  description:
    "Gets the most recent message movement tasks (up to 10) under a specific source queue.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        SourceArn: {
          name: "Source Arn",
          description:
            "The ARN of the queue whose message movement tasks are to be listed.",
          type: "string",
          required: true,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of results to include in the response.",
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

        const command = new ListMessageMoveTasksCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Message Move Tasks Result",
      description: "Result from ListMessageMoveTasks operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Results: {
            type: "array",
            items: {
              type: "object",
              properties: {
                TaskHandle: {
                  type: "string",
                },
                Status: {
                  type: "string",
                },
                SourceArn: {
                  type: "string",
                },
                DestinationArn: {
                  type: "string",
                },
                MaxNumberOfMessagesPerSecond: {
                  type: "number",
                },
                ApproximateNumberOfMessagesMoved: {
                  type: "number",
                },
                ApproximateNumberOfMessagesToMove: {
                  type: "number",
                },
                FailureReason: {
                  type: "string",
                },
                StartedTimestamp: {
                  type: "number",
                },
              },
              additionalProperties: false,
            },
            description:
              "A list of message movement tasks and their attributes.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listMessageMoveTasks;
