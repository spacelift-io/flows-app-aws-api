import { AppBlock, events } from "@slflows/sdk/v1";
import {
  ECSClient,
  UpdateServicePrimaryTaskSetCommand,
} from "@aws-sdk/client-ecs";

const updateServicePrimaryTaskSet: AppBlock = {
  name: "Update Service Primary Task Set",
  description: "Modifies which task set in a service is the primary task set.",
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
            "The short name or full Amazon Resource Name (ARN) of the cluster that hosts the service that the task set exists in.",
          type: "string",
          required: true,
        },
        service: {
          name: "service",
          description:
            "The short name or full Amazon Resource Name (ARN) of the service that the task set exists in.",
          type: "string",
          required: true,
        },
        primaryTaskSet: {
          name: "primary Task Set",
          description:
            "The short name or full Amazon Resource Name (ARN) of the task set to set as the primary task set in the deployment.",
          type: "string",
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

        const command = new UpdateServicePrimaryTaskSetCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Service Primary Task Set Result",
      description: "Result from UpdateServicePrimaryTaskSet operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          taskSet: {
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
              scale: {
                type: "object",
                properties: {
                  value: {
                    type: "number",
                  },
                  unit: {
                    type: "string",
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
              fargateEphemeralStorage: {
                type: "object",
                properties: {
                  kmsKeyId: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
            },
            additionalProperties: false,
            description: "The details about the task set.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateServicePrimaryTaskSet;
