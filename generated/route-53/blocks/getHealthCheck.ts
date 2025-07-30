import { AppBlock, events } from "@slflows/sdk/v1";
import { Route53Client, GetHealthCheckCommand } from "@aws-sdk/client-route-53";

const getHealthCheck: AppBlock = {
  name: "Get Health Check",
  description: "Gets information about a specified health check.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        HealthCheckId: {
          name: "Health Check Id",
          description:
            "The identifier that Amazon Route 53 assigned to the health check when you created it.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new Route53Client({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new GetHealthCheckCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Health Check Result",
      description: "Result from GetHealthCheck operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          HealthCheck: {
            type: "object",
            properties: {
              Id: {
                type: "string",
              },
              CallerReference: {
                type: "string",
              },
              LinkedService: {
                type: "object",
                properties: {
                  ServicePrincipal: {
                    type: "string",
                  },
                  Description: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              HealthCheckConfig: {
                type: "object",
                properties: {
                  IPAddress: {
                    type: "string",
                  },
                  Port: {
                    type: "number",
                  },
                  Type: {
                    type: "string",
                  },
                  ResourcePath: {
                    type: "string",
                  },
                  FullyQualifiedDomainName: {
                    type: "string",
                  },
                  SearchString: {
                    type: "string",
                  },
                  RequestInterval: {
                    type: "number",
                  },
                  FailureThreshold: {
                    type: "number",
                  },
                  MeasureLatency: {
                    type: "boolean",
                  },
                  Inverted: {
                    type: "boolean",
                  },
                  Disabled: {
                    type: "boolean",
                  },
                  HealthThreshold: {
                    type: "number",
                  },
                  ChildHealthChecks: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  EnableSNI: {
                    type: "boolean",
                  },
                  Regions: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  AlarmIdentifier: {
                    type: "object",
                    properties: {
                      Region: {
                        type: "string",
                      },
                      Name: {
                        type: "string",
                      },
                    },
                    required: ["Region", "Name"],
                    additionalProperties: false,
                  },
                  InsufficientDataHealthStatus: {
                    type: "string",
                  },
                  RoutingControlArn: {
                    type: "string",
                  },
                },
                required: ["Type"],
                additionalProperties: false,
              },
              HealthCheckVersion: {
                type: "number",
              },
              CloudWatchAlarmConfiguration: {
                type: "object",
                properties: {
                  EvaluationPeriods: {
                    type: "number",
                  },
                  Threshold: {
                    type: "number",
                  },
                  ComparisonOperator: {
                    type: "string",
                  },
                  Period: {
                    type: "number",
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
                },
                required: [
                  "EvaluationPeriods",
                  "Threshold",
                  "ComparisonOperator",
                  "Period",
                  "MetricName",
                  "Namespace",
                  "Statistic",
                ],
                additionalProperties: false,
              },
            },
            required: [
              "Id",
              "CallerReference",
              "HealthCheckConfig",
              "HealthCheckVersion",
            ],
            additionalProperties: false,
            description:
              "A complex type that contains information about one health check that is associated with the current Amazon Web Services account.",
          },
        },
        required: ["HealthCheck"],
      },
    },
  },
};

export default getHealthCheck;
