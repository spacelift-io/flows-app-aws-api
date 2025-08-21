import { AppBlock, events } from "@slflows/sdk/v1";
import { SQSClient, RemovePermissionCommand } from "@aws-sdk/client-sqs";

const removePermission: AppBlock = {
  name: "Remove Permission",
  description:
    "Revokes any permissions in the queue policy that matches the specified Label parameter.",
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
          description:
            "The URL of the Amazon SQS queue from which permissions are removed.",
          type: "string",
          required: true,
        },
        Label: {
          name: "Label",
          description: "The identification of the permission to remove.",
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

        const command = new RemovePermissionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Remove Permission Result",
      description: "Result from RemovePermission operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default removePermission;
