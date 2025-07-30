import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudWatchClient,
  GetMetricStreamCommand,
} from "@aws-sdk/client-cloudwatch";

const getMetricStream: AppBlock = {
  name: "Get Metric Stream",
  description: "Returns information about the metric stream that you specify.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Name: {
          name: "Name",
          description:
            "The name of the metric stream to retrieve information about.",
          type: "string",
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

        const command = new GetMetricStreamCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Metric Stream Result",
      description: "Result from GetMetricStream operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Arn: {
            type: "string",
            description: "The ARN of the metric stream.",
          },
          Name: {
            type: "string",
            description: "The name of the metric stream.",
          },
          IncludeFilters: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Namespace: {
                  type: "string",
                },
                MetricNames: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              additionalProperties: false,
            },
            description:
              "If this array of metric namespaces is present, then these namespaces are the only metric namespaces that are streamed by this metric stream.",
          },
          ExcludeFilters: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Namespace: {
                  type: "string",
                },
                MetricNames: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              additionalProperties: false,
            },
            description:
              "If this array of metric namespaces is present, then these namespaces are the only metric namespaces that are not streamed by this metric stream.",
          },
          FirehoseArn: {
            type: "string",
            description:
              "The ARN of the Amazon Kinesis Data Firehose delivery stream that is used by this metric stream.",
          },
          RoleArn: {
            type: "string",
            description:
              "The ARN of the IAM role that is used by this metric stream.",
          },
          State: {
            type: "string",
            description: "The state of the metric stream.",
          },
          CreationDate: {
            type: "string",
            description: "The date that the metric stream was created.",
          },
          LastUpdateDate: {
            type: "string",
            description:
              "The date of the most recent update to the metric stream's configuration.",
          },
          OutputFormat: {
            type: "string",
            description: "The output format for the stream.",
          },
          StatisticsConfigurations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                IncludeMetrics: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Namespace: {
                        type: "object",
                        additionalProperties: true,
                      },
                      MetricName: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    required: ["Namespace", "MetricName"],
                    additionalProperties: false,
                  },
                },
                AdditionalStatistics: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              required: ["IncludeMetrics", "AdditionalStatistics"],
              additionalProperties: false,
            },
            description:
              "Each entry in this array displays information about one or more metrics that include additional statistics in the metric stream.",
          },
          IncludeLinkedAccountsMetrics: {
            type: "boolean",
            description:
              "If this is true and this metric stream is in a monitoring account, then the stream includes metrics from source accounts that the monitoring account is linked to.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getMetricStream;
