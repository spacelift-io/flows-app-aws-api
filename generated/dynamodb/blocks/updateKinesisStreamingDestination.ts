import { AppBlock, events } from "@slflows/sdk/v1";
import {
  DynamoDBClient,
  UpdateKinesisStreamingDestinationCommand,
} from "@aws-sdk/client-dynamodb";

const updateKinesisStreamingDestination: AppBlock = {
  name: "Update Kinesis Streaming Destination",
  description: "The command to update the Kinesis stream destination.",
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
          description:
            "The table name for the Kinesis streaming destination input.",
          type: "string",
          required: true,
        },
        StreamArn: {
          name: "Stream Arn",
          description:
            "The Amazon Resource Name (ARN) for the Kinesis stream input.",
          type: "string",
          required: true,
        },
        UpdateKinesisStreamingConfiguration: {
          name: "Update Kinesis Streaming Configuration",
          description:
            "The command to update the Kinesis stream configuration.",
          type: {
            type: "object",
            properties: {
              ApproximateCreationDateTimePrecision: {
                type: "string",
              },
            },
            additionalProperties: false,
          },
          required: false,
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

        const command = new UpdateKinesisStreamingDestinationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Kinesis Streaming Destination Result",
      description: "Result from UpdateKinesisStreamingDestination operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TableName: {
            type: "string",
            description:
              "The table name for the Kinesis streaming destination output.",
          },
          StreamArn: {
            type: "string",
            description: "The ARN for the Kinesis stream input.",
          },
          DestinationStatus: {
            type: "string",
            description:
              "The status of the attempt to update the Kinesis streaming destination output.",
          },
          UpdateKinesisStreamingConfiguration: {
            type: "object",
            properties: {
              ApproximateCreationDateTimePrecision: {
                type: "string",
              },
            },
            additionalProperties: false,
            description:
              "The command to update the Kinesis streaming destination configuration.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateKinesisStreamingDestination;
