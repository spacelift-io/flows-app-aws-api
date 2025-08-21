import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, CancelCommandCommand } from "@aws-sdk/client-ssm";

const cancelCommand: AppBlock = {
  name: "Cancel Command",
  description: "Attempts to cancel the command specified by the Command ID.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        CommandId: {
          name: "Command Id",
          description: "The ID of the command you want to cancel.",
          type: "string",
          required: true,
        },
        InstanceIds: {
          name: "Instance Ids",
          description:
            "(Optional) A list of managed node IDs on which you want to cancel the command.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new SSMClient({
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

        const command = new CancelCommandCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Cancel Command Result",
      description: "Result from CancelCommand operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default cancelCommand;
