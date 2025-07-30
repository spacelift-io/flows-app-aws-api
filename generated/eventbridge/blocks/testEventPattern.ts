import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EventBridgeClient,
  TestEventPatternCommand,
} from "@aws-sdk/client-eventbridge";

const testEventPattern: AppBlock = {
  name: "Test Event Pattern",
  description:
    "Tests whether the specified event pattern matches the provided event.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        EventPattern: {
          name: "Event Pattern",
          description: "The event pattern.",
          type: "string",
          required: true,
        },
        Event: {
          name: "Event",
          description:
            "The event, in JSON format, to test against the event pattern.",
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

        const command = new TestEventPatternCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Test Event Pattern Result",
      description: "Result from TestEventPattern operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Result: {
            type: "boolean",
            description:
              "Indicates whether the event matches the event pattern.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default testEventPattern;
