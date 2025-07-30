import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EventBridgeClient,
  ListReplaysCommand,
} from "@aws-sdk/client-eventbridge";

const listReplays: AppBlock = {
  name: "List Replays",
  description: "Lists your replays.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        NamePrefix: {
          name: "Name Prefix",
          description: "A name prefix to filter the replays returned.",
          type: "string",
          required: false,
        },
        State: {
          name: "State",
          description: "The state of the replay.",
          type: "string",
          required: false,
        },
        EventSourceArn: {
          name: "Event Source Arn",
          description:
            "The ARN of the archive from which the events are replayed.",
          type: "string",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description:
            "The token returned by a previous call, which you can use to retrieve the next set of results.",
          type: "string",
          required: false,
        },
        Limit: {
          name: "Limit",
          description: "The maximum number of replays to retrieve.",
          type: "number",
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
        });

        const command = new ListReplaysCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Replays Result",
      description: "Result from ListReplays operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Replays: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ReplayName: {
                  type: "string",
                },
                EventSourceArn: {
                  type: "string",
                },
                State: {
                  type: "string",
                },
                StateReason: {
                  type: "string",
                },
                EventStartTime: {
                  type: "string",
                },
                EventEndTime: {
                  type: "string",
                },
                EventLastReplayedTime: {
                  type: "string",
                },
                ReplayStartTime: {
                  type: "string",
                },
                ReplayEndTime: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "An array of Replay objects that contain information about the replay.",
          },
          NextToken: {
            type: "string",
            description: "A token indicating there are more results available.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listReplays;
