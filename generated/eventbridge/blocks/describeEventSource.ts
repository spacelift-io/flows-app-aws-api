import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EventBridgeClient,
  DescribeEventSourceCommand,
} from "@aws-sdk/client-eventbridge";

const describeEventSource: AppBlock = {
  name: "Describe Event Source",
  description:
    "This operation lists details about a partner event source that is shared with your account.",
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
          description:
            "The name of the partner event source to display the details of.",
          type: "string",
          required: true,
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

        const command = new DescribeEventSourceCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Event Source Result",
      description: "Result from DescribeEventSource operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Arn: {
            type: "string",
            description: "The ARN of the partner event source.",
          },
          CreatedBy: {
            type: "string",
            description:
              "The name of the SaaS partner that created the event source.",
          },
          CreationTime: {
            type: "string",
            description: "The date and time that the event source was created.",
          },
          ExpirationTime: {
            type: "string",
            description:
              "The date and time that the event source will expire if you do not create a matching event bus.",
          },
          Name: {
            type: "string",
            description: "The name of the partner event source.",
          },
          State: {
            type: "string",
            description: "The state of the event source.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeEventSource;
