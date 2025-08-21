import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudTrailClient,
  StartEventDataStoreIngestionCommand,
} from "@aws-sdk/client-cloudtrail";

const startEventDataStoreIngestion: AppBlock = {
  name: "Start Event Data Store Ingestion",
  description:
    "Starts the ingestion of live events on an event data store specified as either an ARN or the ID portion of the ARN.",
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
            "The ARN (or ID suffix of the ARN) of the event data store for which you want to start ingestion.",
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

        const command = new StartEventDataStoreIngestionCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Start Event Data Store Ingestion Result",
      description: "Result from StartEventDataStoreIngestion operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default startEventDataStoreIngestion;
