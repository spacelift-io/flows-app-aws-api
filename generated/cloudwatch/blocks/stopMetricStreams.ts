import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudWatchClient,
  StopMetricStreamsCommand,
} from "@aws-sdk/client-cloudwatch";

const stopMetricStreams: AppBlock = {
  name: "Stop Metric Streams",
  description:
    "Stops the streaming of metrics for one or more of your metric streams.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Names: {
          name: "Names",
          description:
            "The array of the names of metric streams to stop streaming.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudWatchClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new StopMetricStreamsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Stop Metric Streams Result",
      description: "Result from StopMetricStreams operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default stopMetricStreams;
