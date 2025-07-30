import { AppBlock, events } from "@slflows/sdk/v1";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const publish: AppBlock = {
  name: "Publish",
  description:
    "Sends a message to an Amazon SNS topic, a text message (SMS message) directly to a phone number, or a message to a mobile platform endpoint (when you specify the TargetArn).",
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
          description: "The topic you want to publish to.",
          type: "string",
          required: false,
        },
        TargetArn: {
          name: "Target Arn",
          description:
            "If you don't specify a value for the TargetArn parameter, you must specify a value for the PhoneNumber or TopicArn parameters.",
          type: "string",
          required: false,
        },
        PhoneNumber: {
          name: "Phone Number",
          description:
            "The phone number to which you want to deliver an SMS message.",
          type: "string",
          required: false,
        },
        Message: {
          name: "Message",
          description: "The message you want to send.",
          type: "string",
          required: true,
        },
        Subject: {
          name: "Subject",
          description:
            'Optional parameter to be used as the "Subject" line when the message is delivered to email endpoints.',
          type: "string",
          required: false,
        },
        MessageStructure: {
          name: "Message Structure",
          description:
            "Set MessageStructure to json if you want to send a different message for each protocol.",
          type: "string",
          required: false,
        },
        MessageAttributes: {
          name: "Message Attributes",
          description: "Message attributes for Publish action.",
          type: {
            type: "object",
            additionalProperties: {
              type: "object",
            },
          },
          required: false,
        },
        MessageDeduplicationId: {
          name: "Message Deduplication Id",
          description:
            "This parameter applies only to FIFO (first-in-first-out) topics.",
          type: "string",
          required: false,
        },
        MessageGroupId: {
          name: "Message Group Id",
          description:
            "This parameter applies only to FIFO (first-in-first-out) topics.",
          type: "string",
          required: false,
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

        const command = new PublishCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Publish Result",
      description: "Result from Publish operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          MessageId: {
            type: "string",
            description: "Unique identifier assigned to the published message.",
          },
          SequenceNumber: {
            type: "string",
            description:
              "This response element applies only to FIFO (first-in-first-out) topics.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default publish;
