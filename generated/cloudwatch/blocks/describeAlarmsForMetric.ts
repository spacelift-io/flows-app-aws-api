import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudWatchClient,
  DescribeAlarmsForMetricCommand,
} from "@aws-sdk/client-cloudwatch";

const describeAlarmsForMetric: AppBlock = {
  name: "Describe Alarms For Metric",
  description: "Retrieves the alarms for the specified metric.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        MetricName: {
          name: "Metric Name",
          description: "The name of the metric.",
          type: "string",
          required: true,
        },
        Namespace: {
          name: "Namespace",
          description: "The namespace of the metric.",
          type: "string",
          required: true,
        },
        Statistic: {
          name: "Statistic",
          description: "The statistic for the metric, other than percentiles.",
          type: "string",
          required: false,
        },
        ExtendedStatistic: {
          name: "Extended Statistic",
          description: "The percentile statistic for the metric.",
          type: "string",
          required: false,
        },
        Dimensions: {
          name: "Dimensions",
          description: "The dimensions associated with the metric.",
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
        Period: {
          name: "Period",
          description:
            "The period, in seconds, over which the statistic is applied.",
          type: "number",
          required: false,
        },
        Unit: {
          name: "Unit",
          description: "The unit for the metric.",
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

        const command = new DescribeAlarmsForMetricCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Alarms For Metric Result",
      description: "Result from DescribeAlarmsForMetric operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          MetricAlarms: {
            type: "array",
            items: {
              type: "object",
              properties: {
                AlarmName: {
                  type: "string",
                },
                AlarmArn: {
                  type: "string",
                },
                AlarmDescription: {
                  type: "string",
                },
                AlarmConfigurationUpdatedTimestamp: {
                  type: "string",
                },
                ActionsEnabled: {
                  type: "boolean",
                },
                OKActions: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                AlarmActions: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                InsufficientDataActions: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                StateValue: {
                  type: "string",
                },
                StateReason: {
                  type: "string",
                },
                StateReasonData: {
                  type: "string",
                },
                StateUpdatedTimestamp: {
                  type: "string",
                },
                MetricName: {
                  type: "string",
                },
                Namespace: {
                  type: "string",
                },
                Statistic: {
                  type: "string",
                },
                ExtendedStatistic: {
                  type: "string",
                },
                Dimensions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Name: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Value: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    required: ["Name", "Value"],
                    additionalProperties: false,
                  },
                },
                Period: {
                  type: "number",
                },
                Unit: {
                  type: "string",
                },
                EvaluationPeriods: {
                  type: "number",
                },
                DatapointsToAlarm: {
                  type: "number",
                },
                Threshold: {
                  type: "number",
                },
                ComparisonOperator: {
                  type: "string",
                },
                TreatMissingData: {
                  type: "string",
                },
                EvaluateLowSampleCountPercentile: {
                  type: "string",
                },
                Metrics: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Id: {
                        type: "object",
                        additionalProperties: true,
                      },
                      MetricStat: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Expression: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Label: {
                        type: "object",
                        additionalProperties: true,
                      },
                      ReturnData: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Period: {
                        type: "object",
                        additionalProperties: true,
                      },
                      AccountId: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    required: ["Id"],
                    additionalProperties: false,
                  },
                },
                ThresholdMetricId: {
                  type: "string",
                },
                EvaluationState: {
                  type: "string",
                },
                StateTransitionedTimestamp: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "The information for each alarm with the specified metric.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeAlarmsForMetric;
