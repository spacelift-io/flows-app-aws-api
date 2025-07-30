import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EventBridgeClient,
  ActivateEventSourceCommand,
} from "@aws-sdk/client-eventbridge";

const activateEventSource: AppBlock = {
  name: "Activate Event Source",
  description: "Activates a partner event source that has been deactivated.",
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
          description: "The name of the partner event source to activate.",
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

        const command = new ActivateEventSourceCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Activate Event Source Result",
      description: "Result from ActivateEventSource operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default activateEventSource;
