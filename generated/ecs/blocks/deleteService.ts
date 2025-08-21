import { AppBlock, events } from "@slflows/sdk/v1";
import { ECSClient, DeleteServiceCommand } from "@aws-sdk/client-ecs";

const deleteService: AppBlock = {
  name: "Delete Service",
  description: "Deletes a specified service within a cluster.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        cluster: {
          name: "cluster",
          description:
            "The short name or full Amazon Resource Name (ARN) of the cluster that hosts the service to delete.",
          type: "string",
          required: false,
        },
        service: {
          name: "service",
          description: "The name of the service to delete.",
          type: "string",
          required: true,
        },
        force: {
          name: "force",
          description:
            "If true, allows you to delete a service even if it wasn't scaled down to zero tasks.",
          type: "boolean",
          required: false,
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new DeleteServiceCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Service Result",
      description: "Result from DeleteService operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          service: {
            type: "object",
            properties: {
              serviceArn: {
                type: "string",
              },
              serviceName: {
                type: "string",
              },
              clusterArn: {
                type: "string",
              },
              loadBalancers: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    targetGroupArn: {
                      type: "string",
                    },
                    loadBalancerName: {
                      type: "string",
                    },
                    containerName: {
                      type: "string",
                    },
                    containerPort: {
                      type: "number",
                    },
                    advancedConfiguration: {
                      type: "object",
                      properties: {
                        alternateTargetGroupArn: {
                          type: "object",
                          additionalProperties: true,
                        },
                        productionListenerRule: {
                          type: "object",
                          additionalProperties: true,
                        },
                        testListenerRule: {
                          type: "object",
                          additionalProperties: true,
                        },
                        roleArn: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                  additionalProperties: false,
                },
              },
              serviceRegistries: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    registryArn: {
                      type: "string",
                    },
                    port: {
                      type: "number",
                    },
                    containerName: {
                      type: "string",
                    },
                    containerPort: {
                      type: "number",
                    },
                  },
                  additionalProperties: false,
                },
              },
              status: {
                type: "string",
              },
              desiredCount: {
                type: "number",
              },
              runningCount: {
                type: "number",
              },
              pendingCount: {
                type: "number",
              },
              launchType: {
                type: "string",
              },
              capacityProviderStrategy: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    capacityProvider: {
                      type: "string",
                    },
                    weight: {
                      type: "number",
                    },
                    base: {
                      type: "number",
                    },
                  },
                  required: ["capacityProvider"],
                  additionalProperties: false,
                },
              },
              platformVersion: {
                type: "string",
              },
              platformFamily: {
                type: "string",
              },
              taskDefinition: {
                type: "string",
              },
              deploymentConfiguration: {
                type: "object",
                properties: {
                  deploymentCircuitBreaker: {
                    type: "object",
                    properties: {
                      enable: {
                        type: "boolean",
                      },
                      rollback: {
                        type: "boolean",
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
                        type: "array",
                        items: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      rollback: {
                        type: "boolean",
                      },
                      enable: {
                        type: "boolean",
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
                      properties: {
                        hookTargetArn: {
                          type: "object",
                          additionalProperties: true,
                        },
                        roleArn: {
                          type: "object",
                          additionalProperties: true,
                        },
                        lifecycleStages: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                },
                additionalProperties: false,
              },
              taskSets: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: {
                      type: "string",
                    },
                    taskSetArn: {
                      type: "string",
                    },
                    serviceArn: {
                      type: "string",
                    },
                    clusterArn: {
                      type: "string",
                    },
                    startedBy: {
                      type: "string",
                    },
                    externalId: {
                      type: "string",
                    },
                    status: {
                      type: "string",
                    },
                    taskDefinition: {
                      type: "string",
                    },
                    computedDesiredCount: {
                      type: "number",
                    },
                    pendingCount: {
                      type: "number",
                    },
                    runningCount: {
                      type: "number",
                    },
                    createdAt: {
                      type: "string",
                    },
                    updatedAt: {
                      type: "string",
                    },
                    launchType: {
                      type: "string",
                    },
                    capacityProviderStrategy: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    platformVersion: {
                      type: "string",
                    },
                    platformFamily: {
                      type: "string",
                    },
                    networkConfiguration: {
                      type: "object",
                      properties: {
                        awsvpcConfiguration: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                    loadBalancers: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    serviceRegistries: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    scale: {
                      type: "object",
                      properties: {
                        value: {
                          type: "object",
                          additionalProperties: true,
                        },
                        unit: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                    stabilityStatus: {
                      type: "string",
                    },
                    stabilityStatusAt: {
                      type: "string",
                    },
                    tags: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    fargateEphemeralStorage: {
                      type: "object",
                      properties: {
                        kmsKeyId: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                  additionalProperties: false,
                },
              },
              deployments: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: {
                      type: "string",
                    },
                    status: {
                      type: "string",
                    },
                    taskDefinition: {
                      type: "string",
                    },
                    desiredCount: {
                      type: "number",
                    },
                    pendingCount: {
                      type: "number",
                    },
                    runningCount: {
                      type: "number",
                    },
                    failedTasks: {
                      type: "number",
                    },
                    createdAt: {
                      type: "string",
                    },
                    updatedAt: {
                      type: "string",
                    },
                    capacityProviderStrategy: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    launchType: {
                      type: "string",
                    },
                    platformVersion: {
                      type: "string",
                    },
                    platformFamily: {
                      type: "string",
                    },
                    networkConfiguration: {
                      type: "object",
                      properties: {
                        awsvpcConfiguration: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                    rolloutState: {
                      type: "string",
                    },
                    rolloutStateReason: {
                      type: "string",
                    },
                    serviceConnectConfiguration: {
                      type: "object",
                      properties: {
                        enabled: {
                          type: "object",
                          additionalProperties: true,
                        },
                        namespace: {
                          type: "object",
                          additionalProperties: true,
                        },
                        services: {
                          type: "object",
                          additionalProperties: true,
                        },
                        logConfiguration: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["enabled"],
                      additionalProperties: false,
                    },
                    serviceConnectResources: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    volumeConfigurations: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    fargateEphemeralStorage: {
                      type: "object",
                      properties: {
                        kmsKeyId: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                    vpcLatticeConfigurations: {
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
              roleArn: {
                type: "string",
              },
              events: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: {
                      type: "string",
                    },
                    createdAt: {
                      type: "string",
                    },
                    message: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              createdAt: {
                type: "string",
              },
              placementConstraints: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type: {
                      type: "string",
                    },
                    expression: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              placementStrategy: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type: {
                      type: "string",
                    },
                    field: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              networkConfiguration: {
                type: "object",
                properties: {
                  awsvpcConfiguration: {
                    type: "object",
                    properties: {
                      subnets: {
                        type: "array",
                        items: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      securityGroups: {
                        type: "array",
                        items: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      assignPublicIp: {
                        type: "string",
                      },
                    },
                    required: ["subnets"],
                    additionalProperties: false,
                  },
                },
                additionalProperties: false,
              },
              healthCheckGracePeriodSeconds: {
                type: "number",
              },
              schedulingStrategy: {
                type: "string",
              },
              deploymentController: {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                  },
                },
                required: ["type"],
                additionalProperties: false,
              },
              tags: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    key: {
                      type: "string",
                    },
                    value: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              createdBy: {
                type: "string",
              },
              enableECSManagedTags: {
                type: "boolean",
              },
              propagateTags: {
                type: "string",
              },
              enableExecuteCommand: {
                type: "boolean",
              },
              availabilityZoneRebalancing: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "The full description of the deleted service.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteService;
