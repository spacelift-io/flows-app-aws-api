import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudWatchClient,
  PutMetricDataCommand,
} from "@aws-sdk/client-cloudwatch";

const putMetricData: AppBlock = {
  name: "Put Metric Data",
  description: "Publishes metric data to Amazon CloudWatch.",
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
          description: "The namespace for the metric data.",
          type: "string",
          required: true,
        },
        MetricData: {
          name: "Metric Data",
          description: "The data for the metrics.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                MetricName: {
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
                Timestamp: {
                  type: "string",
                },
                Value: {
                  type: "number",
                },
                StatisticValues: {
                  type: "object",
                  properties: {
                    SampleCount: {
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
                  },
                  required: ["SampleCount", "Sum", "Minimum", "Maximum"],
                  additionalProperties: false,
                },
                Values: {
                  type: "array",
                  items: {
                    type: "number",
                  },
                },
                Counts: {
                  type: "array",
                  items: {
                    type: "number",
                  },
                },
                Unit: {
                  type: "string",
                },
                StorageResolution: {
                  type: "number",
                },
              },
              required: ["MetricName"],
              additionalProperties: false,
            },
          },
          required: false,
        },
        EntityMetricData: {
          name: "Entity Metric Data",
          description:
            "Data for metrics that contain associated entity information.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Entity: {
                  type: "object",
                  properties: {
                    KeyAttributes: {
                      type: "object",
                      additionalProperties: {
                        type: "object",
                      },
                    },
                    Attributes: {
                      type: "object",
                      additionalProperties: {
                        type: "object",
                      },
                    },
                  },
                  additionalProperties: false,
                },
                MetricData: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      MetricName: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Dimensions: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Timestamp: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Value: {
                        type: "object",
                        additionalProperties: true,
                      },
                      StatisticValues: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Values: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Counts: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Unit: {
                        type: "object",
                        additionalProperties: true,
                      },
                      StorageResolution: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    required: ["MetricName"],
                    additionalProperties: false,
                  },
                },
              },
              additionalProperties: false,
            },
          },
          required: false,
        },
        StrictEntityValidation: {
          name: "Strict Entity Validation",
          description:
            "Whether to accept valid metric data when an invalid entity is sent.",
          type: "boolean",
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

        const command = new PutMetricDataCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Metric Data Result",
      description: "Result from PutMetricData operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default putMetricData;
