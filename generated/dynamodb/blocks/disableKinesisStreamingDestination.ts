import { AppBlock, events } from "@slflows/sdk/v1";
import {
  DynamoDBClient,
  DisableKinesisStreamingDestinationCommand,
} from "@aws-sdk/client-dynamodb";

const disableKinesisStreamingDestination: AppBlock = {
  name: "Disable Kinesis Streaming Destination",
  description:
    "Stops replication from the DynamoDB table to the Kinesis data stream.",
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
          description: "The name of the DynamoDB table.",
          type: "string",
          required: true,
        },
        StreamArn: {
          name: "Stream Arn",
          description: "The ARN for a Kinesis data stream.",
          type: "string",
          required: true,
        },
        EnableKinesisStreamingConfiguration: {
          name: "Enable Kinesis Streaming Configuration",
          description:
            "The source for the Kinesis streaming information that is being enabled.",
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

        const command = new DisableKinesisStreamingDestinationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Disable Kinesis Streaming Destination Result",
      description: "Result from DisableKinesisStreamingDestination operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TableName: {
            type: "string",
            description: "The name of the table being modified.",
          },
          StreamArn: {
            type: "string",
            description: "The ARN for the specific Kinesis data stream.",
          },
          DestinationStatus: {
            type: "string",
            description: "The current status of the replication.",
          },
          EnableKinesisStreamingConfiguration: {
            type: "object",
            properties: {
              ApproximateCreationDateTimePrecision: {
                type: "string",
              },
            },
            additionalProperties: false,
            description:
              "The destination for the Kinesis streaming information that is being enabled.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default disableKinesisStreamingDestination;
