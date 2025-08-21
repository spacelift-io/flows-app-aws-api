import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudWatchClient,
  DeleteAnomalyDetectorCommand,
} from "@aws-sdk/client-cloudwatch";

const deleteAnomalyDetector: AppBlock = {
  name: "Delete Anomaly Detector",
  description:
    "Deletes the specified anomaly detection model from your account.",
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
            "The namespace associated with the anomaly detection model to delete.",
          type: "string",
          required: false,
        },
        MetricName: {
          name: "Metric Name",
          description:
            "The metric name associated with the anomaly detection model to delete.",
          type: "string",
          required: false,
        },
        Dimensions: {
          name: "Dimensions",
          description:
            "The metric dimensions associated with the anomaly detection model to delete.",
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
            "The statistic associated with the anomaly detection model to delete.",
          type: "string",
          required: false,
        },
        SingleMetricAnomalyDetector: {
          name: "Single Metric Anomaly Detector",
          description: "A single metric anomaly detector to be deleted.",
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
          description: "The metric math anomaly detector to be deleted.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new DeleteAnomalyDetectorCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Anomaly Detector Result",
      description: "Result from DeleteAnomalyDetector operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default deleteAnomalyDetector;
