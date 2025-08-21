import { AppBlock, events } from "@slflows/sdk/v1";
import {
  DynamoDBClient,
  DescribeKinesisStreamingDestinationCommand,
} from "@aws-sdk/client-dynamodb";

const describeKinesisStreamingDestination: AppBlock = {
  name: "Describe Kinesis Streaming Destination",
  description: "Returns information about the status of Kinesis streaming.",
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
          description: "The name of the table being described.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new DescribeKinesisStreamingDestinationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Kinesis Streaming Destination Result",
      description: "Result from DescribeKinesisStreamingDestination operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TableName: {
            type: "string",
            description: "The name of the table being described.",
          },
          KinesisDataStreamDestinations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                StreamArn: {
                  type: "string",
                },
                DestinationStatus: {
                  type: "string",
                },
                DestinationStatusDescription: {
                  type: "string",
                },
                ApproximateCreationDateTimePrecision: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "The list of replica structures for the table being described.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeKinesisStreamingDestination;
