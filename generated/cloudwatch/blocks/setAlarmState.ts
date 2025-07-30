import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudWatchClient,
  SetAlarmStateCommand,
} from "@aws-sdk/client-cloudwatch";

const setAlarmState: AppBlock = {
  name: "Set Alarm State",
  description: "Temporarily sets the state of an alarm for testing purposes.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        AlarmName: {
          name: "Alarm Name",
          description: "The name of the alarm.",
          type: "string",
          required: true,
        },
        StateValue: {
          name: "State Value",
          description: "The value of the state.",
          type: "string",
          required: true,
        },
        StateReason: {
          name: "State Reason",
          description:
            "The reason that this alarm is set to this specific state, in text format.",
          type: "string",
          required: true,
        },
        StateReasonData: {
          name: "State Reason Data",
          description:
            "The reason that this alarm is set to this specific state, in JSON format.",
          type: "string",
          required: false,
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

        const command = new SetAlarmStateCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Set Alarm State Result",
      description: "Result from SetAlarmState operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default setAlarmState;
