import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EventBridgeClient,
  DescribeEventBusCommand,
} from "@aws-sdk/client-eventbridge";

const describeEventBus: AppBlock = {
  name: "Describe Event Bus",
  description: "Displays details about an event bus in your account.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Name: {
          name: "Name",
          description: "The name or ARN of the event bus to show details for.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new EventBridgeClient({
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

        const command = new DescribeEventBusCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Event Bus Result",
      description: "Result from DescribeEventBus operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Name: {
            type: "string",
            description: "The name of the event bus.",
          },
          Arn: {
            type: "string",
            description:
              "The Amazon Resource Name (ARN) of the account permitted to write events to the current account.",
          },
          Description: {
            type: "string",
            description: "The event bus description.",
          },
          KmsKeyIdentifier: {
            type: "string",
            description:
              "The identifier of the KMS customer managed key for EventBridge to use to encrypt events on this event bus, if one has been specified.",
          },
          DeadLetterConfig: {
            type: "object",
            properties: {
              Arn: {
                type: "string",
              },
            },
            additionalProperties: false,
            description:
              "Configuration details of the Amazon SQS queue for EventBridge to use as a dead-letter queue (DLQ).",
          },
          Policy: {
            type: "string",
            description:
              "The policy that enables the external account to send events to your account.",
          },
          LogConfig: {
            type: "object",
            properties: {
              IncludeDetail: {
                type: "string",
              },
              Level: {
                type: "string",
              },
            },
            additionalProperties: false,
            description:
              "The logging configuration settings for the event bus.",
          },
          CreationTime: {
            type: "string",
            description: "The time the event bus was created.",
          },
          LastModifiedTime: {
            type: "string",
            description: "The time the event bus was last modified.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeEventBus;
