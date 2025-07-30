import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudWatchClient,
  GetMetricStatisticsCommand,
} from "@aws-sdk/client-cloudwatch";

const getMetricStatistics: AppBlock = {
  name: "Get Metric Statistics",
  description: "Gets statistics for the specified metric.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Namespace: {
          name: "Namespace",
          description: "The namespace of the metric, with or without spaces.",
          type: "string",
          required: true,
        },
        MetricName: {
          name: "Metric Name",
          description: "The name of the metric, with or without spaces.",
          type: "string",
          required: true,
        },
        Dimensions: {
          name: "Dimensions",
          description: "The dimensions.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: {
                  type: "string",
                },
                Value: {
                  type: "string",
                },
              },
              required: ["Name", "Value"],
              additionalProperties: false,
            },
          },
          required: false,
        },
        StartTime: {
          name: "Start Time",
          description:
            "The time stamp that determines the first data point to return.",
          type: "string",
          required: true,
        },
        EndTime: {
          name: "End Time",
          description:
            "The time stamp that determines the last data point to return.",
          type: "string",
          required: true,
        },
        Period: {
          name: "Period",
          description:
            "The granularity, in seconds, of the returned data points.",
          type: "number",
          required: true,
        },
        Statistics: {
          name: "Statistics",
          description: "The metric statistics, other than percentile.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        ExtendedStatistics: {
          name: "Extended Statistics",
          description: "The percentile statistics.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        Unit: {
          name: "Unit",
          description: "The unit for a given metric.",
          type: "string",
          required: false,
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

        const command = new GetMetricStatisticsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Metric Statistics Result",
      description: "Result from GetMetricStatistics operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Label: {
            type: "string",
            description: "A label for the specified metric.",
          },
          Datapoints: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Timestamp: {
                  type: "string",
                },
                SampleCount: {
                  type: "number",
                },
                Average: {
                  type: "number",
                },
                Sum: {
                  type: "number",
                },
                Minimum: {
                  type: "number",
                },
                Maximum: {
                  type: "number",
                },
                Unit: {
                  type: "string",
                },
                ExtendedStatistics: {
                  type: "object",
                  additionalProperties: {
                    type: "number",
                  },
                },
              },
              additionalProperties: false,
            },
            description: "The data points for the specified metric.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getMetricStatistics;
