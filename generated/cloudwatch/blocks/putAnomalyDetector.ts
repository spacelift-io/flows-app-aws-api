import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudWatchClient,
  PutAnomalyDetectorCommand,
} from "@aws-sdk/client-cloudwatch";

const putAnomalyDetector: AppBlock = {
  name: "Put Anomaly Detector",
  description: "Creates an anomaly detection model for a CloudWatch metric.",
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
          description:
            "The namespace of the metric to create the anomaly detection model for.",
          type: "string",
          required: false,
        },
        MetricName: {
          name: "Metric Name",
          description:
            "The name of the metric to create the anomaly detection model for.",
          type: "string",
          required: false,
        },
        Dimensions: {
          name: "Dimensions",
          description:
            "The metric dimensions to create the anomaly detection model for.",
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
        Stat: {
          name: "Stat",
          description:
            "The statistic to use for the metric and the anomaly detection model.",
          type: "string",
          required: false,
        },
        Configuration: {
          name: "Configuration",
          description:
            "The configuration specifies details about how the anomaly detection model is to be trained, including time ranges to exclude when training and updating the model.",
          type: {
            type: "object",
            properties: {
              ExcludedTimeRanges: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    StartTime: {
                      type: "string",
                    },
                    EndTime: {
                      type: "string",
                    },
                  },
                  required: ["StartTime", "EndTime"],
                  additionalProperties: false,
                },
              },
              MetricTimezone: {
                type: "string",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        MetricCharacteristics: {
          name: "Metric Characteristics",
          description:
            "Use this object to include parameters to provide information about your metric to CloudWatch to help it build more accurate anomaly detection models.",
          type: {
            type: "object",
            properties: {
              PeriodicSpikes: {
                type: "boolean",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        SingleMetricAnomalyDetector: {
          name: "Single Metric Anomaly Detector",
          description: "A single metric anomaly detector to be created.",
          type: {
            type: "object",
            properties: {
              AccountId: {
                type: "string",
              },
              Namespace: {
                type: "string",
              },
              MetricName: {
                type: "string",
              },
              Dimensions: {
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
              Stat: {
                type: "string",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        MetricMathAnomalyDetector: {
          name: "Metric Math Anomaly Detector",
          description: "The metric math anomaly detector to be created.",
          type: {
            type: "object",
            properties: {
              MetricDataQueries: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Id: {
                      type: "string",
                    },
                    MetricStat: {
                      type: "object",
                      properties: {
                        Metric: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Period: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Stat: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Unit: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["Metric", "Period", "Stat"],
                      additionalProperties: false,
                    },
                    Expression: {
                      type: "string",
                    },
                    Label: {
                      type: "string",
                    },
                    ReturnData: {
                      type: "boolean",
                    },
                    Period: {
                      type: "number",
                    },
                    AccountId: {
                      type: "string",
                    },
                  },
                  required: ["Id"],
                  additionalProperties: false,
                },
              },
            },
            additionalProperties: false,
          },
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

        const command = new PutAnomalyDetectorCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Anomaly Detector Result",
      description: "Result from PutAnomalyDetector operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default putAnomalyDetector;
