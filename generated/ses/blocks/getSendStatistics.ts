import { AppBlock, events } from "@slflows/sdk/v1";
import { SESClient, GetSendStatisticsCommand } from "@aws-sdk/client-ses";

const getSendStatistics: AppBlock = {
  name: "Get Send Statistics",
  description:
    "Provides sending statistics for the current Amazon Web Services Region.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new SESClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new GetSendStatisticsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Send Statistics Result",
      description: "Result from GetSendStatistics operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          SendDataPoints: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Timestamp: {
                  type: "string",
                },
                DeliveryAttempts: {
                  type: "number",
                },
                Bounces: {
                  type: "number",
                },
                Complaints: {
                  type: "number",
                },
                Rejects: {
                  type: "number",
                },
              },
              additionalProperties: false,
            },
            description:
              "A list of data points, each of which represents 15 minutes of activity.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getSendStatistics;
