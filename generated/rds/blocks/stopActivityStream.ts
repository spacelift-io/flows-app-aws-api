import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, StopActivityStreamCommand } from "@aws-sdk/client-rds";

const stopActivityStream: AppBlock = {
  name: "Stop Activity Stream",
  description:
    "Stops a database activity stream that was started using the Amazon Web Services console, the start-activity-stream CLI command, or the StartActivityStream operation.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ResourceArn: {
          name: "Resource Arn",
          description:
            "The Amazon Resource Name (ARN) of the DB cluster for the database activity stream.",
          type: "string",
          required: true,
        },
        ApplyImmediately: {
          name: "Apply Immediately",
          description:
            "Specifies whether or not the database activity stream is to stop as soon as possible, regardless of the maintenance window for the database.",
          type: "boolean",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new RDSClient({
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

        const command = new StopActivityStreamCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Stop Activity Stream Result",
      description: "Result from StopActivityStream operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          KmsKeyId: {
            type: "string",
            description:
              "The Amazon Web Services KMS key identifier used for encrypting messages in the database activity stream.",
          },
          KinesisStreamName: {
            type: "string",
            description:
              "The name of the Amazon Kinesis data stream used for the database activity stream.",
          },
          Status: {
            type: "string",
            description: "The status of the database activity stream.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default stopActivityStream;
