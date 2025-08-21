import { AppBlock, events } from "@slflows/sdk/v1";
import { SNSClient, PublishBatchCommand } from "@aws-sdk/client-sns";

const publishBatch: AppBlock = {
  name: "Publish Batch",
  description: "Publishes up to ten messages to the specified topic.",
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
            "The Amazon resource name (ARN) of the topic you want to batch publish to.",
          type: "string",
          required: true,
        },
        PublishBatchRequestEntries: {
          name: "Publish Batch Request Entries",
          description:
            "A list of PublishBatch request entries to be sent to the SNS topic.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Id: {
                  type: "string",
                },
                Message: {
                  type: "string",
                },
                Subject: {
                  type: "string",
                },
                MessageStructure: {
                  type: "string",
                },
                MessageAttributes: {
                  type: "object",
                  additionalProperties: {
                    type: "object",
                  },
                },
                MessageDeduplicationId: {
                  type: "string",
                },
                MessageGroupId: {
                  type: "string",
                },
              },
              required: ["Id", "Message"],
              additionalProperties: false,
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new PublishBatchCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Publish Batch Result",
      description: "Result from PublishBatch operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Successful: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Id: {
                  type: "string",
                },
                MessageId: {
                  type: "string",
                },
                SequenceNumber: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "A list of successful PublishBatch responses.",
          },
          Failed: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Id: {
                  type: "string",
                },
                Code: {
                  type: "string",
                },
                Message: {
                  type: "string",
                },
                SenderFault: {
                  type: "boolean",
                },
              },
              required: ["Id", "Code", "SenderFault"],
              additionalProperties: false,
            },
            description: "A list of failed PublishBatch responses.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default publishBatch;
