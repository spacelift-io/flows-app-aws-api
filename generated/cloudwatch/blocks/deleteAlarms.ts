import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudWatchClient,
  DeleteAlarmsCommand,
} from "@aws-sdk/client-cloudwatch";

const deleteAlarms: AppBlock = {
  name: "Delete Alarms",
  description: "Deletes the specified alarms.",
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
          description: "The alarms to be deleted.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new DeleteAlarmsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Alarms Result",
      description: "Result from DeleteAlarms operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteAlarms;
