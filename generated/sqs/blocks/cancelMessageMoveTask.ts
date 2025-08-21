import { AppBlock, events } from "@slflows/sdk/v1";
import { SQSClient, CancelMessageMoveTaskCommand } from "@aws-sdk/client-sqs";

const cancelMessageMoveTask: AppBlock = {
  name: "Cancel Message Move Task",
  description: "Cancels a specified message movement task.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TaskHandle: {
          name: "Task Handle",
          description: "An identifier associated with a message movement task.",
          type: "string",
          required: true,
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

        const command = new CancelMessageMoveTaskCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Cancel Message Move Task Result",
      description: "Result from CancelMessageMoveTask operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ApproximateNumberOfMessagesMoved: {
            type: "number",
            description:
              "The approximate number of messages already moved to the destination queue.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default cancelMessageMoveTask;
