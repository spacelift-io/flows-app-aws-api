import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, DeleteResourceDataSyncCommand } from "@aws-sdk/client-ssm";

const deleteResourceDataSync: AppBlock = {
  name: "Delete Resource Data Sync",
  description: "Deletes a resource data sync configuration.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        SyncName: {
          name: "Sync Name",
          description: "The name of the configuration to delete.",
          type: "string",
          required: true,
        },
        SyncType: {
          name: "Sync Type",
          description: "Specify the type of resource data sync to delete.",
          type: "string",
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
        });

        const command = new DeleteResourceDataSyncCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Resource Data Sync Result",
      description: "Result from DeleteResourceDataSync operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default deleteResourceDataSync;
