import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EventBridgeClient,
  DeactivateEventSourceCommand,
} from "@aws-sdk/client-eventbridge";

const deactivateEventSource: AppBlock = {
  name: "Deactivate Event Source",
  description:
    "You can use this operation to temporarily stop receiving events from the specified partner event source.",
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
          description: "The name of the partner event source to deactivate.",
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

        const command = new DeactivateEventSourceCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Deactivate Event Source Result",
      description: "Result from DeactivateEventSource operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deactivateEventSource;
