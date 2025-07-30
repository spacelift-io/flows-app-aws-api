import { AppBlock, events } from "@slflows/sdk/v1";
import { SQSClient, AddPermissionCommand } from "@aws-sdk/client-sqs";

const addPermission: AppBlock = {
  name: "Add Permission",
  description: "Adds a permission to a queue for a specific principal.",
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
            "The URL of the Amazon SQS queue to which permissions are added.",
          type: "string",
          required: true,
        },
        Label: {
          name: "Label",
          description:
            "The unique identification of the permission you're setting (for example, AliceSendMessage).",
          type: "string",
          required: true,
        },
        AWSAccountIds: {
          name: "AWS Account Ids",
          description:
            "The Amazon Web Services account numbers of the principals who are to receive permission.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: true,
        },
        Actions: {
          name: "Actions",
          description:
            "The action the client wants to allow for the specified principal.",
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

        const client = new SQSClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new AddPermissionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Add Permission Result",
      description: "Result from AddPermission operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default addPermission;
