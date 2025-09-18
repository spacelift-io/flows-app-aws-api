import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  DeleteScheduledActionCommand,
} from "@aws-sdk/client-redshift";

const deleteScheduledAction: AppBlock = {
  name: "Delete Scheduled Action",
  description: `Deletes a scheduled action.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ScheduledActionName: {
          name: "Scheduled Action Name",
          description: "The name of the scheduled action to delete.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new RedshiftClient({
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

        const command = new DeleteScheduledActionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Scheduled Action Result",
      description: "Result from DeleteScheduledAction operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteScheduledAction;
