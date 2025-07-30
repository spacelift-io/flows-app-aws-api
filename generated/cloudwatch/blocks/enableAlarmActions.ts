import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudWatchClient,
  EnableAlarmActionsCommand,
} from "@aws-sdk/client-cloudwatch";

const enableAlarmActions: AppBlock = {
  name: "Enable Alarm Actions",
  description: "Enables the actions for the specified alarms.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        AlarmNames: {
          name: "Alarm Names",
          description: "The names of the alarms.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudWatchClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new EnableAlarmActionsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Enable Alarm Actions Result",
      description: "Result from EnableAlarmActions operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default enableAlarmActions;
