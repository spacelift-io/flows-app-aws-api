import { AppBlock, events } from "@slflows/sdk/v1";
import { SNSClient, RemovePermissionCommand } from "@aws-sdk/client-sns";

const removePermission: AppBlock = {
  name: "Remove Permission",
  description: "Removes a statement from a topic's access control policy.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TopicArn: {
          name: "Topic Arn",
          description:
            "The ARN of the topic whose access control policy you wish to modify.",
          type: "string",
          required: true,
        },
        Label: {
          name: "Label",
          description: "The unique label of the statement you want to remove.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new SNSClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
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
