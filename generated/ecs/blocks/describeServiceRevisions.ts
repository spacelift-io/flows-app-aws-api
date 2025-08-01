import { AppBlock, events } from "@slflows/sdk/v1";
import {
  ECSClient,
  DescribeServiceRevisionsCommand,
} from "@aws-sdk/client-ecs";

const describeServiceRevisions: AppBlock = {
  name: "Describe Service Revisions",
  description: "Describes one or more service revisions.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        serviceRevisionArns: {
          name: "service Revision Arns",
          description: "The ARN of the service revision.",
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

        const command = new DescribeServiceRevisionsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Service Revisions Result",
      description: "Result from DescribeServiceRevisions operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          serviceRevisions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                serviceRevisionArn: {
                  type: "string",
                },
                serviceArn: {
                  type: "string",
                },
                clusterArn: {
                  type: "string",
                },
                taskDefinition: {
                  type: "string",
                },
                capacityProviderStrategy: {
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
                launchType: {
                  type: "string",
                },
                platformVersion: {
                  type: "string",
                },
                platformFamily: {
                  type: "string",
                },
                loadBalancers: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      targetGroupArn: {
                        type: "object",
                        additionalProperties: true,
                      },
                      loadBalancerName: {
                        type: "object",
                        additionalProperties: true,
                      },
                      containerName: {
                        type: "object",
                        additionalProperties: true,
                      },
                      containerPort: {
                        type: "object",
                        additionalProperties: true,
                      },
                      advancedConfiguration: {
                        type: "object",
                        additionalProperties: true,
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
                        type: "object",
                        additionalProperties: true,
                      },
                      port: {
                        type: "object",
                        additionalProperties: true,
                      },
                      containerName: {
                        type: "object",
                        additionalProperties: true,
                      },
                      containerPort: {
                        type: "object",
                        additionalProperties: true,
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
                          type: "object",
                          additionalProperties: true,
                        },
                        securityGroups: {
                          type: "object",
                          additionalProperties: true,
                        },
                        assignPublicIp: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["subnets"],
                      additionalProperties: false,
                    },
                  },
                  additionalProperties: false,
                },
                containerImages: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      containerName: {
                        type: "object",
                        additionalProperties: true,
                      },
                      imageDigest: {
                        type: "object",
                        additionalProperties: true,
                      },
                      image: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                guardDutyEnabled: {
                  type: "boolean",
                },
                serviceConnectConfiguration: {
                  type: "object",
                  properties: {
                    enabled: {
                      type: "boolean",
                    },
                    namespace: {
                      type: "string",
                    },
                    services: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    logConfiguration: {
                      type: "object",
                      properties: {
                        logDriver: {
                          type: "object",
                          additionalProperties: true,
                        },
                        options: {
                          type: "object",
                          additionalProperties: true,
                        },
                        secretOptions: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["logDriver"],
                      additionalProperties: false,
                    },
                  },
                  required: ["enabled"],
                  additionalProperties: false,
                },
                volumeConfigurations: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: {
                        type: "object",
                        additionalProperties: true,
                      },
                      managedEBSVolume: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    required: ["name"],
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
                createdAt: {
                  type: "string",
                },
                vpcLatticeConfigurations: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      roleArn: {
                        type: "object",
                        additionalProperties: true,
                      },
                      targetGroupArn: {
                        type: "object",
                        additionalProperties: true,
                      },
                      portName: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    required: ["roleArn", "targetGroupArn", "portName"],
                    additionalProperties: false,
                  },
                },
                resolvedConfiguration: {
                  type: "object",
                  properties: {
                    loadBalancers: {
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
            description: "The list of service revisions described.",
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

export default describeServiceRevisions;
