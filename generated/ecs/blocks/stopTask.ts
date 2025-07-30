import { AppBlock, events } from "@slflows/sdk/v1";
import { ECSClient, StopTaskCommand } from "@aws-sdk/client-ecs";

const stopTask: AppBlock = {
  name: "Stop Task",
  description: "Stops a running task.",
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
            "The short name or full Amazon Resource Name (ARN) of the cluster that hosts the task to stop.",
          type: "string",
          required: false,
        },
        task: {
          name: "task",
          description: "Thefull Amazon Resource Name (ARN) of the task.",
          type: "string",
          required: true,
        },
        reason: {
          name: "reason",
          description: "An optional message specified when a task is stopped.",
          type: "string",
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
        });

        const command = new StopTaskCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Stop Task Result",
      description: "Result from StopTask operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          task: {
            type: "object",
            properties: {
              attachments: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: {
                      type: "string",
                    },
                    type: {
                      type: "string",
                    },
                    status: {
                      type: "string",
                    },
                    details: {
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
              attributes: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                    },
                    value: {
                      type: "string",
                    },
                    targetType: {
                      type: "string",
                    },
                    targetId: {
                      type: "string",
                    },
                  },
                  required: ["name"],
                  additionalProperties: false,
                },
              },
              availabilityZone: {
                type: "string",
              },
              capacityProviderName: {
                type: "string",
              },
              clusterArn: {
                type: "string",
              },
              connectivity: {
                type: "string",
              },
              connectivityAt: {
                type: "string",
              },
              containerInstanceArn: {
                type: "string",
              },
              containers: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    containerArn: {
                      type: "string",
                    },
                    taskArn: {
                      type: "string",
                    },
                    name: {
                      type: "string",
                    },
                    image: {
                      type: "string",
                    },
                    imageDigest: {
                      type: "string",
                    },
                    runtimeId: {
                      type: "string",
                    },
                    lastStatus: {
                      type: "string",
                    },
                    exitCode: {
                      type: "number",
                    },
                    reason: {
                      type: "string",
                    },
                    networkBindings: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    networkInterfaces: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    healthStatus: {
                      type: "string",
                    },
                    managedAgents: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    cpu: {
                      type: "string",
                    },
                    memory: {
                      type: "string",
                    },
                    memoryReservation: {
                      type: "string",
                    },
                    gpuIds: {
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
              cpu: {
                type: "string",
              },
              createdAt: {
                type: "string",
              },
              desiredStatus: {
                type: "string",
              },
              enableExecuteCommand: {
                type: "boolean",
              },
              executionStoppedAt: {
                type: "string",
              },
              group: {
                type: "string",
              },
              healthStatus: {
                type: "string",
              },
              inferenceAccelerators: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    deviceName: {
                      type: "string",
                    },
                    deviceType: {
                      type: "string",
                    },
                  },
                  required: ["deviceName", "deviceType"],
                  additionalProperties: false,
                },
              },
              lastStatus: {
                type: "string",
              },
              launchType: {
                type: "string",
              },
              memory: {
                type: "string",
              },
              overrides: {
                type: "object",
                properties: {
                  containerOverrides: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: {
                          type: "object",
                          additionalProperties: true,
                        },
                        command: {
                          type: "object",
                          additionalProperties: true,
                        },
                        environment: {
                          type: "object",
                          additionalProperties: true,
                        },
                        environmentFiles: {
                          type: "object",
                          additionalProperties: true,
                        },
                        cpu: {
                          type: "object",
                          additionalProperties: true,
                        },
                        memory: {
                          type: "object",
                          additionalProperties: true,
                        },
                        memoryReservation: {
                          type: "object",
                          additionalProperties: true,
                        },
                        resourceRequirements: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                  cpu: {
                    type: "string",
                  },
                  inferenceAcceleratorOverrides: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        deviceName: {
                          type: "object",
                          additionalProperties: true,
                        },
                        deviceType: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                  executionRoleArn: {
                    type: "string",
                  },
                  memory: {
                    type: "string",
                  },
                  taskRoleArn: {
                    type: "string",
                  },
                  ephemeralStorage: {
                    type: "object",
                    properties: {
                      sizeInGiB: {
                        type: "number",
                      },
                    },
                    required: ["sizeInGiB"],
                    additionalProperties: false,
                  },
                },
                additionalProperties: false,
              },
              platformVersion: {
                type: "string",
              },
              platformFamily: {
                type: "string",
              },
              pullStartedAt: {
                type: "string",
              },
              pullStoppedAt: {
                type: "string",
              },
              startedAt: {
                type: "string",
              },
              startedBy: {
                type: "string",
              },
              stopCode: {
                type: "string",
              },
              stoppedAt: {
                type: "string",
              },
              stoppedReason: {
                type: "string",
              },
              stoppingAt: {
                type: "string",
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
              taskArn: {
                type: "string",
              },
              taskDefinitionArn: {
                type: "string",
              },
              version: {
                type: "number",
              },
              ephemeralStorage: {
                type: "object",
                properties: {
                  sizeInGiB: {
                    type: "number",
                  },
                },
                required: ["sizeInGiB"],
                additionalProperties: false,
              },
              fargateEphemeralStorage: {
                type: "object",
                properties: {
                  sizeInGiB: {
                    type: "number",
                  },
                  kmsKeyId: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
            },
            additionalProperties: false,
            description: "The task that was stopped.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default stopTask;
