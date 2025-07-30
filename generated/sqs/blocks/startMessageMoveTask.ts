import { AppBlock, events } from "@slflows/sdk/v1";
import { SQSClient, StartMessageMoveTaskCommand } from "@aws-sdk/client-sqs";

const startMessageMoveTask: AppBlock = {
  name: "Start Message Move Task",
  description:
    "Starts an asynchronous task to move messages from a specified source queue to a specified destination queue.",
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
            "The ARN of the queue that contains the messages to be moved to another queue.",
          type: "string",
          required: true,
        },
        DestinationArn: {
          name: "Destination Arn",
          description: "The ARN of the queue that receives the moved messages.",
          type: "string",
          required: false,
        },
        MaxNumberOfMessagesPerSecond: {
          name: "Max Number Of Messages Per Second",
          description:
            "The number of messages to be moved per second (the message movement rate).",
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
        });

        const command = new StartMessageMoveTaskCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Start Message Move Task Result",
      description: "Result from StartMessageMoveTask operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TaskHandle: {
            type: "string",
            description:
              "An identifier associated with a message movement task.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default startMessageMoveTask;
