import { AppBlock, events } from "@slflows/sdk/v1";
import { EKSClient, RegisterClusterCommand } from "@aws-sdk/client-eks";

const registerCluster: AppBlock = {
  name: "Register Cluster",
  description: "Connects a Kubernetes cluster to the Amazon EKS control plane.",
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
          description:
            "A unique name for this cluster in your Amazon Web Services Region.",
          type: "string",
          required: true,
        },
        connectorConfig: {
          name: "connector Config",
          description:
            "The configuration settings required to connect the Kubernetes cluster to the Amazon EKS control plane.",
          type: {
            type: "object",
            properties: {
              roleArn: {
                type: "string",
              },
              provider: {
                type: "string",
              },
            },
            required: ["roleArn", "provider"],
            additionalProperties: false,
          },
          required: true,
        },
        clientRequestToken: {
          name: "client Request Token",
          description:
            "A unique, case-sensitive identifier that you provide to ensure the idempotency of the request.",
          type: "string",
          required: false,
        },
        tags: {
          name: "tags",
          description:
            "Metadata that assists with categorization and organization.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
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
        });

        const command = new RegisterClusterCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Register Cluster Result",
      description: "Result from RegisterCluster operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          cluster: {
            type: "object",
            properties: {
              name: {
                type: "string",
              },
              arn: {
                type: "string",
              },
              createdAt: {
                type: "string",
              },
              version: {
                type: "string",
              },
              endpoint: {
                type: "string",
              },
              roleArn: {
                type: "string",
              },
              resourcesVpcConfig: {
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
                  clusterSecurityGroupId: {
                    type: "string",
                  },
                  vpcId: {
                    type: "string",
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
              kubernetesNetworkConfig: {
                type: "object",
                properties: {
                  serviceIpv4Cidr: {
                    type: "string",
                  },
                  serviceIpv6Cidr: {
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
              logging: {
                type: "object",
                properties: {
                  clusterLogging: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        types: {
                          type: "object",
                          additionalProperties: true,
                        },
                        enabled: {
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
              identity: {
                type: "object",
                properties: {
                  oidc: {
                    type: "object",
                    properties: {
                      issuer: {
                        type: "string",
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
              certificateAuthority: {
                type: "object",
                properties: {
                  data: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              clientRequestToken: {
                type: "string",
              },
              platformVersion: {
                type: "string",
              },
              tags: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
              },
              encryptionConfig: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    resources: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    provider: {
                      type: "object",
                      properties: {
                        keyArn: {
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
              connectorConfig: {
                type: "object",
                properties: {
                  activationId: {
                    type: "string",
                  },
                  activationCode: {
                    type: "string",
                  },
                  activationExpiry: {
                    type: "string",
                  },
                  provider: {
                    type: "string",
                  },
                  roleArn: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              id: {
                type: "string",
              },
              health: {
                type: "object",
                properties: {
                  issues: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        code: {
                          type: "object",
                          additionalProperties: true,
                        },
                        message: {
                          type: "object",
                          additionalProperties: true,
                        },
                        resourceIds: {
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
              outpostConfig: {
                type: "object",
                properties: {
                  outpostArns: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  controlPlaneInstanceType: {
                    type: "string",
                  },
                  controlPlanePlacement: {
                    type: "object",
                    properties: {
                      groupName: {
                        type: "string",
                      },
                    },
                    additionalProperties: false,
                  },
                },
                required: ["outpostArns", "controlPlaneInstanceType"],
                additionalProperties: false,
              },
              accessConfig: {
                type: "object",
                properties: {
                  bootstrapClusterCreatorAdminPermissions: {
                    type: "boolean",
                  },
                  authenticationMode: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              upgradePolicy: {
                type: "object",
                properties: {
                  supportType: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              zonalShiftConfig: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                  },
                },
                additionalProperties: false,
              },
              remoteNetworkConfig: {
                type: "object",
                properties: {
                  remoteNodeNetworks: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        cidrs: {
                          type: "object",
                          additionalProperties: true,
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
              computeConfig: {
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
              storageConfig: {
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
            },
            additionalProperties: false,
            description: "An object representing an Amazon EKS cluster.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default registerCluster;
