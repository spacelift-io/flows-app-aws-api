import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EventBridgeClient,
  DescribeReplayCommand,
} from "@aws-sdk/client-eventbridge";

const describeReplay: AppBlock = {
  name: "Describe Replay",
  description: "Retrieves details about a replay.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ReplayName: {
          name: "Replay Name",
          description: "The name of the replay to retrieve.",
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

        const command = new DescribeReplayCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Replay Result",
      description: "Result from DescribeReplay operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ReplayName: {
            type: "string",
            description: "The name of the replay.",
          },
          ReplayArn: {
            type: "string",
            description: "The ARN of the replay.",
          },
          Description: {
            type: "string",
            description: "The description of the replay.",
          },
          State: {
            type: "string",
            description: "The current state of the replay.",
          },
          StateReason: {
            type: "string",
            description: "The reason that the replay is in the current state.",
          },
          EventSourceArn: {
            type: "string",
            description: "The ARN of the archive events were replayed from.",
          },
          Destination: {
            type: "object",
            properties: {
              Arn: {
                type: "string",
              },
              FilterArns: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },
            required: ["Arn"],
            additionalProperties: false,
            description:
              "A ReplayDestination object that contains details about the replay.",
          },
          EventStartTime: {
            type: "string",
            description:
              "The time stamp of the first event that was last replayed from the archive.",
          },
          EventEndTime: {
            type: "string",
            description:
              "The time stamp for the last event that was replayed from the archive.",
          },
          EventLastReplayedTime: {
            type: "string",
            description: "The time that the event was last replayed.",
          },
          ReplayStartTime: {
            type: "string",
            description: "A time stamp for the time that the replay started.",
          },
          ReplayEndTime: {
            type: "string",
            description: "A time stamp for the time that the replay stopped.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeReplay;
