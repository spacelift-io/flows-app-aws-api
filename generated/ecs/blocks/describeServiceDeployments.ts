import { AppBlock, events } from "@slflows/sdk/v1";
import {
  ECSClient,
  DescribeServiceDeploymentsCommand,
} from "@aws-sdk/client-ecs";

const describeServiceDeployments: AppBlock = {
  name: "Describe Service Deployments",
  description: "Describes one or more of your service deployments.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        serviceDeploymentArns: {
          name: "service Deployment Arns",
          description: "The ARN of the service deployment.",
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

        const client = new ECSClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new DescribeServiceDeploymentsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Service Deployments Result",
      description: "Result from DescribeServiceDeployments operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          serviceDeployments: {
            type: "array",
            items: {
              type: "object",
              properties: {
                serviceDeploymentArn: {
                  type: "string",
                },
                serviceArn: {
                  type: "string",
                },
                clusterArn: {
                  type: "string",
                },
                createdAt: {
                  type: "string",
                },
                startedAt: {
                  type: "string",
                },
                finishedAt: {
                  type: "string",
                },
                stoppedAt: {
                  type: "string",
                },
                updatedAt: {
                  type: "string",
                },
                sourceServiceRevisions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      arn: {
                        type: "object",
                        additionalProperties: true,
                      },
                      requestedTaskCount: {
                        type: "object",
                        additionalProperties: true,
                      },
                      runningTaskCount: {
                        type: "object",
                        additionalProperties: true,
                      },
                      pendingTaskCount: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                targetServiceRevision: {
                  type: "object",
                  properties: {
                    arn: {
                      type: "string",
                    },
                    requestedTaskCount: {
                      type: "number",
                    },
                    runningTaskCount: {
                      type: "number",
                    },
                    pendingTaskCount: {
                      type: "number",
                    },
                  },
                  additionalProperties: false,
                },
                status: {
                  type: "string",
                },
                statusReason: {
                  type: "string",
                },
                lifecycleStage: {
                  type: "string",
                },
                deploymentConfiguration: {
                  type: "object",
                  properties: {
                    deploymentCircuitBreaker: {
                      type: "object",
                      properties: {
                        enable: {
                          type: "object",
                          additionalProperties: true,
                        },
                        rollback: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["enable", "rollback"],
                      additionalProperties: false,
                    },
                    maximumPercent: {
                      type: "number",
                    },
                    minimumHealthyPercent: {
                      type: "number",
                    },
                    alarms: {
                      type: "object",
                      properties: {
                        alarmNames: {
                          type: "object",
                          additionalProperties: true,
                        },
                        rollback: {
                          type: "object",
                          additionalProperties: true,
                        },
                        enable: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["alarmNames", "rollback", "enable"],
                      additionalProperties: false,
                    },
                    strategy: {
                      type: "string",
                    },
                    bakeTimeInMinutes: {
                      type: "number",
                    },
                    lifecycleHooks: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                  },
                  additionalProperties: false,
                },
                rollback: {
                  type: "object",
                  properties: {
                    reason: {
                      type: "string",
                    },
                    startedAt: {
                      type: "string",
                    },
                    serviceRevisionArn: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                deploymentCircuitBreaker: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                    },
                    failureCount: {
                      type: "number",
                    },
                    threshold: {
                      type: "number",
                    },
                  },
                  additionalProperties: false,
                },
                alarms: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                    },
                    alarmNames: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    triggeredAlarmNames: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                  },
                  additionalProperties: false,
                },
              },
              additionalProperties: false,
            },
            description: "The list of service deployments described.",
          },
          failures: {
            type: "array",
            items: {
              type: "object",
              properties: {
                arn: {
                  type: "string",
                },
                reason: {
                  type: "string",
                },
                detail: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "Any failures associated with the call.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeServiceDeployments;
