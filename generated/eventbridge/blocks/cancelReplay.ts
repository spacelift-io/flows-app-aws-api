import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EventBridgeClient,
  CancelReplayCommand,
} from "@aws-sdk/client-eventbridge";

const cancelReplay: AppBlock = {
  name: "Cancel Replay",
  description: "Cancels the specified replay.",
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
          description: "The name of the replay to cancel.",
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

        const command = new CancelReplayCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Cancel Replay Result",
      description: "Result from CancelReplay operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ReplayArn: {
            type: "string",
            description: "The ARN of the replay to cancel.",
          },
          State: {
            type: "string",
            description: "The current state of the replay.",
          },
          StateReason: {
            type: "string",
            description: "The reason that the replay is in the current state.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default cancelReplay;
