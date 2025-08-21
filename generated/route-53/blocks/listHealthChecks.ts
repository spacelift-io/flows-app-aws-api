import { AppBlock, events } from "@slflows/sdk/v1";
import {
  Route53Client,
  ListHealthChecksCommand,
} from "@aws-sdk/client-route-53";

const listHealthChecks: AppBlock = {
  name: "List Health Checks",
  description:
    "Retrieve a list of the health checks that are associated with the current Amazon Web Services account.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Marker: {
          name: "Marker",
          description:
            "If the value of IsTruncated in the previous response was true, you have more health checks.",
          type: "string",
          required: false,
        },
        MaxItems: {
          name: "Max Items",
          description:
            "The maximum number of health checks that you want ListHealthChecks to return in response to the current request.",
          type: "string",
          required: false,
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

        const command = new ListHealthChecksCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Health Checks Result",
      description: "Result from ListHealthChecks operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          HealthChecks: {
            type: "array",
            items: {
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
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    EnableSNI: {
                      type: "boolean",
                    },
                    Regions: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    AlarmIdentifier: {
                      type: "object",
                      properties: {
                        Region: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Name: {
                          type: "object",
                          additionalProperties: true,
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
                        additionalProperties: true,
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
            },
            description:
              "A complex type that contains one HealthCheck element for each health check that is associated with the current Amazon Web Services account.",
          },
          Marker: {
            type: "string",
            description:
              "For the second and subsequent calls to ListHealthChecks, Marker is the value that you specified for the marker parameter in the previous request.",
          },
          IsTruncated: {
            type: "boolean",
            description:
              "A flag that indicates whether there are more health checks to be listed.",
          },
          NextMarker: {
            type: "string",
            description:
              "If IsTruncated is true, the value of NextMarker identifies the first health check that Amazon Route 53 returns if you submit another ListHealthChecks request and specify the value of NextMarker in the marker parameter.",
          },
          MaxItems: {
            type: "string",
            description:
              "The value that you specified for the maxitems parameter in the call to ListHealthChecks that produced the current response.",
          },
        },
        required: ["HealthChecks", "Marker", "IsTruncated", "MaxItems"],
      },
    },
  },
};

export default listHealthChecks;
