import { AppBlock, events } from "@slflows/sdk/v1";
import {
  Route53Client,
  CreateHealthCheckCommand,
} from "@aws-sdk/client-route-53";

const createHealthCheck: AppBlock = {
  name: "Create Health Check",
  description: "Creates a new health check.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        CallerReference: {
          name: "Caller Reference",
          description:
            "A unique string that identifies the request and that allows you to retry a failed CreateHealthCheck request without the risk of creating two identical health checks: If you send a CreateHealthCheck request with the same CallerReference and settings as a previous request, and if the health check doesn't exist, Amazon Route 53 creates the health check.",
          type: "string",
          required: true,
        },
        HealthCheckConfig: {
          name: "Health Check Config",
          description:
            "A complex type that contains settings for a new health check.",
          type: {
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new CreateHealthCheckCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Health Check Result",
      description: "Result from CreateHealthCheck operation",
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
              "A complex type that contains identifying information about the health check.",
          },
          Location: {
            type: "string",
            description: "The unique URL representing the new health check.",
          },
        },
        required: ["HealthCheck", "Location"],
      },
    },
  },
};

export default createHealthCheck;
