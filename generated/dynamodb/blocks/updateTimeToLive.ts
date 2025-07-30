import { AppBlock, events } from "@slflows/sdk/v1";
import {
  DynamoDBClient,
  UpdateTimeToLiveCommand,
} from "@aws-sdk/client-dynamodb";

const updateTimeToLive: AppBlock = {
  name: "Update Time To Live",
  description:
    "The UpdateTimeToLive method enables or disables Time to Live (TTL) for the specified table.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TableName: {
          name: "Table Name",
          description: "The name of the table to be configured.",
          type: "string",
          required: true,
        },
        TimeToLiveSpecification: {
          name: "Time To Live Specification",
          description:
            "Represents the settings used to enable or disable Time to Live for the specified table.",
          type: {
            type: "object",
            properties: {
              Enabled: {
                type: "boolean",
              },
              AttributeName: {
                type: "string",
              },
            },
            required: ["Enabled", "AttributeName"],
            additionalProperties: false,
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new DynamoDBClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new UpdateTimeToLiveCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Time To Live Result",
      description: "Result from UpdateTimeToLive operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TimeToLiveSpecification: {
            type: "object",
            properties: {
              Enabled: {
                type: "boolean",
              },
              AttributeName: {
                type: "string",
              },
            },
            required: ["Enabled", "AttributeName"],
            additionalProperties: false,
            description:
              "Represents the output of an UpdateTimeToLive operation.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateTimeToLive;
