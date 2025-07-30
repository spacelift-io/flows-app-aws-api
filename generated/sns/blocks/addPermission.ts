import { AppBlock, events } from "@slflows/sdk/v1";
import { SNSClient, AddPermissionCommand } from "@aws-sdk/client-sns";

const addPermission: AppBlock = {
  name: "Add Permission",
  description:
    "Adds a statement to a topic's access control policy, granting access for the specified Amazon Web Services accounts to the specified actions.",
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
          description: "A unique identifier for the new policy statement.",
          type: "string",
          required: true,
        },
        AWSAccountId: {
          name: "AWS Account Id",
          description:
            "The Amazon Web Services account IDs of the users (principals) who will be given access to the specified actions.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: true,
        },
        ActionName: {
          name: "Action Name",
          description:
            "The action you want to allow for the specified principal(s).",
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

        const client = new SNSClient({
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
