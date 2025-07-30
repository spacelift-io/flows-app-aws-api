import { AppBlock, events } from "@slflows/sdk/v1";
import {
  DynamoDBClient,
  DescribeTimeToLiveCommand,
} from "@aws-sdk/client-dynamodb";

const describeTimeToLive: AppBlock = {
  name: "Describe Time To Live",
  description:
    "Gives a description of the Time to Live (TTL) status on the specified table.",
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
          description: "The name of the table to be described.",
          type: "string",
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

        const command = new DescribeTimeToLiveCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Time To Live Result",
      description: "Result from DescribeTimeToLive operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TimeToLiveDescription: {
            type: "object",
            properties: {
              TimeToLiveStatus: {
                type: "string",
              },
              AttributeName: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeTimeToLive;
