import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudTrailClient,
  DeleteEventDataStoreCommand,
} from "@aws-sdk/client-cloudtrail";

const deleteEventDataStore: AppBlock = {
  name: "Delete Event Data Store",
  description:
    "Disables the event data store specified by EventDataStore, which accepts an event data store ARN.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        EventDataStore: {
          name: "Event Data Store",
          description:
            "The ARN (or the ID suffix of the ARN) of the event data store to delete.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudTrailClient({
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

        const command = new DeleteEventDataStoreCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Event Data Store Result",
      description: "Result from DeleteEventDataStore operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default deleteEventDataStore;
