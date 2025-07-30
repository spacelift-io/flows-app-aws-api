import { AppBlock, events } from "@slflows/sdk/v1";
import { ECSClient, DescribeClustersCommand } from "@aws-sdk/client-ecs";

const describeClusters: AppBlock = {
  name: "Describe Clusters",
  description: "Describes one or more of your clusters.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        clusters: {
          name: "clusters",
          description:
            "A list of up to 100 cluster names or full cluster Amazon Resource Name (ARN) entries.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        include: {
          name: "include",
          description:
            "Determines whether to include additional information about the clusters in the response.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
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

        const command = new DescribeClustersCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Clusters Result",
      description: "Result from DescribeClusters operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          clusters: {
            type: "array",
            items: {
              type: "object",
              properties: {
                clusterArn: {
                  type: "string",
                },
                clusterName: {
                  type: "string",
                },
                configuration: {
                  type: "object",
                  properties: {
                    executeCommandConfiguration: {
                      type: "object",
                      properties: {
                        kmsKeyId: {
                          type: "object",
                          additionalProperties: true,
                        },
                        logging: {
                          type: "object",
                          additionalProperties: true,
                        },
                        logConfiguration: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                    managedStorageConfiguration: {
                      type: "object",
                      properties: {
                        kmsKeyId: {
                          type: "object",
                          additionalProperties: true,
                        },
                        fargateEphemeralStorageKmsKeyId: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                  additionalProperties: false,
                },
                status: {
                  type: "string",
                },
                registeredContainerInstancesCount: {
                  type: "number",
                },
                runningTasksCount: {
                  type: "number",
                },
                pendingTasksCount: {
                  type: "number",
                },
                activeServicesCount: {
                  type: "number",
                },
                statistics: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: {
                        type: "object",
                        additionalProperties: true,
                      },
                      value: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                tags: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      key: {
                        type: "object",
                        additionalProperties: true,
                      },
                      value: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                settings: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: {
                        type: "object",
                        additionalProperties: true,
                      },
                      value: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                capacityProviders: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                defaultCapacityProviderStrategy: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      capacityProvider: {
                        type: "object",
                        additionalProperties: true,
                      },
                      weight: {
                        type: "object",
                        additionalProperties: true,
                      },
                      base: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    required: ["capacityProvider"],
                    additionalProperties: false,
                  },
                },
                attachments: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: {
                        type: "object",
                        additionalProperties: true,
                      },
                      type: {
                        type: "object",
                        additionalProperties: true,
                      },
                      status: {
                        type: "object",
                        additionalProperties: true,
                      },
                      details: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                attachmentsStatus: {
                  type: "string",
                },
                serviceConnectDefaults: {
                  type: "object",
                  properties: {
                    namespace: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              additionalProperties: false,
            },
            description: "The list of clusters.",
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

export default describeClusters;
