import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EventBridgeClient,
  DescribePartnerEventSourceCommand,
} from "@aws-sdk/client-eventbridge";

const describePartnerEventSource: AppBlock = {
  name: "Describe Partner Event Source",
  description:
    "An SaaS partner can use this operation to list details about a partner event source that they have created.",
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
          description: "The name of the event source to display.",
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
        });

        const command = new DescribePartnerEventSourceCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Partner Event Source Result",
      description: "Result from DescribePartnerEventSource operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Arn: {
            type: "string",
            description: "The ARN of the event source.",
          },
          Name: {
            type: "string",
            description: "The name of the event source.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describePartnerEventSource;
