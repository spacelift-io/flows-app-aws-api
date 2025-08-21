import { AppBlock, events } from "@slflows/sdk/v1";
import { EKSClient, UpdateClusterConfigCommand } from "@aws-sdk/client-eks";

const updateClusterConfig: AppBlock = {
  name: "Update Cluster Config",
  description: "Updates an Amazon EKS cluster configuration.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        name: {
          name: "name",
          description: "The name of the Amazon EKS cluster to update.",
          type: "string",
          required: true,
        },
        resourcesVpcConfig: {
          name: "resources Vpc Config",
          description:
            "An object representing the VPC configuration to use for an Amazon EKS cluster.",
          type: {
            type: "object",
            properties: {
              subnetIds: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              securityGroupIds: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              endpointPublicAccess: {
                type: "boolean",
              },
              endpointPrivateAccess: {
                type: "boolean",
              },
              publicAccessCidrs: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        logging: {
          name: "logging",
          description:
            "Enable or disable exporting the Kubernetes control plane logs for your cluster to CloudWatch Logs .",
          type: {
            type: "object",
            properties: {
              clusterLogging: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    types: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    enabled: {
                      type: "boolean",
                    },
                  },
                  additionalProperties: false,
                },
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        clientRequestToken: {
          name: "client Request Token",
          description:
            "A unique, case-sensitive identifier that you provide to ensure the idempotency of the request.",
          type: "string",
          required: false,
        },
        accessConfig: {
          name: "access Config",
          description: "The access configuration for the cluster.",
          type: {
            type: "object",
            properties: {
              authenticationMode: {
                type: "string",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        upgradePolicy: {
          name: "upgrade Policy",
          description:
            "You can enable or disable extended support for clusters currently on standard support.",
          type: {
            type: "object",
            properties: {
              supportType: {
                type: "string",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        zonalShiftConfig: {
          name: "zonal Shift Config",
          description: "Enable or disable ARC zonal shift for the cluster.",
          type: {
            type: "object",
            properties: {
              enabled: {
                type: "boolean",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        computeConfig: {
          name: "compute Config",
          description:
            "Update the configuration of the compute capability of your EKS Auto Mode cluster.",
          type: {
            type: "object",
            properties: {
              enabled: {
                type: "boolean",
              },
              nodePools: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              nodeRoleArn: {
                type: "string",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        kubernetesNetworkConfig: {
          name: "kubernetes Network Config",
          description: "The Kubernetes network configuration for the cluster.",
          type: {
            type: "object",
            properties: {
              serviceIpv4Cidr: {
                type: "string",
              },
              ipFamily: {
                type: "string",
              },
              elasticLoadBalancing: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                  },
                },
                additionalProperties: false,
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        storageConfig: {
          name: "storage Config",
          description:
            "Update the configuration of the block storage capability of your EKS Auto Mode cluster.",
          type: {
            type: "object",
            properties: {
              blockStorage: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                  },
                },
                additionalProperties: false,
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        remoteNetworkConfig: {
          name: "remote Network Config",
          description: "The configuration in the cluster for EKS Hybrid Nodes.",
          type: {
            type: "object",
            properties: {
              remoteNodeNetworks: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    cidrs: {
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
              remotePodNetworks: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    cidrs: {
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
            },
            additionalProperties: false,
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new EKSClient({
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

        const command = new UpdateClusterConfigCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Cluster Config Result",
      description: "Result from UpdateClusterConfig operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          update: {
            type: "object",
            properties: {
              id: {
                type: "string",
              },
              status: {
                type: "string",
              },
              type: {
                type: "string",
              },
              params: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type: {
                      type: "string",
                    },
                    value: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              createdAt: {
                type: "string",
              },
              errors: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    errorCode: {
                      type: "string",
                    },
                    errorMessage: {
                      type: "string",
                    },
                    resourceIds: {
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
            },
            additionalProperties: false,
            description: "An object representing an asynchronous update.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateClusterConfig;
