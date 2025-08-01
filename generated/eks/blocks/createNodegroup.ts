import { AppBlock, events } from "@slflows/sdk/v1";
import { EKSClient, CreateNodegroupCommand } from "@aws-sdk/client-eks";

const createNodegroup: AppBlock = {
  name: "Create Nodegroup",
  description: "Creates a managed node group for an Amazon EKS cluster.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        clusterName: {
          name: "cluster Name",
          description: "The name of your cluster.",
          type: "string",
          required: true,
        },
        nodegroupName: {
          name: "nodegroup Name",
          description: "The unique name to give your node group.",
          type: "string",
          required: true,
        },
        scalingConfig: {
          name: "scaling Config",
          description:
            "The scaling configuration details for the Auto Scaling group that is created for your node group.",
          type: {
            type: "object",
            properties: {
              minSize: {
                type: "number",
              },
              maxSize: {
                type: "number",
              },
              desiredSize: {
                type: "number",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        diskSize: {
          name: "disk Size",
          description:
            "The root device disk size (in GiB) for your node group instances.",
          type: "number",
          required: false,
        },
        subnets: {
          name: "subnets",
          description:
            "The subnets to use for the Auto Scaling group that is created for your node group.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: true,
        },
        instanceTypes: {
          name: "instance Types",
          description: "Specify the instance types for a node group.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        amiType: {
          name: "ami Type",
          description: "The AMI type for your node group.",
          type: "string",
          required: false,
        },
        remoteAccess: {
          name: "remote Access",
          description:
            "The remote access configuration to use with your node group.",
          type: {
            type: "object",
            properties: {
              ec2SshKey: {
                type: "string",
              },
              sourceSecurityGroups: {
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
        nodeRole: {
          name: "node Role",
          description:
            "The Amazon Resource Name (ARN) of the IAM role to associate with your node group.",
          type: "string",
          required: true,
        },
        labels: {
          name: "labels",
          description:
            "The Kubernetes labels to apply to the nodes in the node group when they are created.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
          },
          required: false,
        },
        taints: {
          name: "taints",
          description:
            "The Kubernetes taints to be applied to the nodes in the node group.",
          type: {
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
                effect: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
          },
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
        clientRequestToken: {
          name: "client Request Token",
          description:
            "A unique, case-sensitive identifier that you provide to ensure the idempotency of the request.",
          type: "string",
          required: false,
        },
        launchTemplate: {
          name: "launch Template",
          description:
            "An object representing a node group's launch template specification.",
          type: {
            type: "object",
            properties: {
              name: {
                type: "string",
              },
              version: {
                type: "string",
              },
              id: {
                type: "string",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        updateConfig: {
          name: "update Config",
          description: "The node group update configuration.",
          type: {
            type: "object",
            properties: {
              maxUnavailable: {
                type: "number",
              },
              maxUnavailablePercentage: {
                type: "number",
              },
              updateStrategy: {
                type: "string",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        nodeRepairConfig: {
          name: "node Repair Config",
          description: "The node auto repair configuration for the node group.",
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
        capacityType: {
          name: "capacity Type",
          description: "The capacity type for your node group.",
          type: "string",
          required: false,
        },
        version: {
          name: "version",
          description: "The Kubernetes version to use for your managed nodes.",
          type: "string",
          required: false,
        },
        releaseVersion: {
          name: "release Version",
          description:
            "The AMI version of the Amazon EKS optimized AMI to use with your node group.",
          type: "string",
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

        const command = new CreateNodegroupCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Nodegroup Result",
      description: "Result from CreateNodegroup operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          nodegroup: {
            type: "object",
            properties: {
              nodegroupName: {
                type: "string",
              },
              nodegroupArn: {
                type: "string",
              },
              clusterName: {
                type: "string",
              },
              version: {
                type: "string",
              },
              releaseVersion: {
                type: "string",
              },
              createdAt: {
                type: "string",
              },
              modifiedAt: {
                type: "string",
              },
              status: {
                type: "string",
              },
              capacityType: {
                type: "string",
              },
              scalingConfig: {
                type: "object",
                properties: {
                  minSize: {
                    type: "number",
                  },
                  maxSize: {
                    type: "number",
                  },
                  desiredSize: {
                    type: "number",
                  },
                },
                additionalProperties: false,
              },
              instanceTypes: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              subnets: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              remoteAccess: {
                type: "object",
                properties: {
                  ec2SshKey: {
                    type: "string",
                  },
                  sourceSecurityGroups: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                },
                additionalProperties: false,
              },
              amiType: {
                type: "string",
              },
              nodeRole: {
                type: "string",
              },
              labels: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
              },
              taints: {
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
                    effect: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              resources: {
                type: "object",
                properties: {
                  autoScalingGroups: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                  remoteAccessSecurityGroup: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              diskSize: {
                type: "number",
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
              updateConfig: {
                type: "object",
                properties: {
                  maxUnavailable: {
                    type: "number",
                  },
                  maxUnavailablePercentage: {
                    type: "number",
                  },
                  updateStrategy: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              nodeRepairConfig: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                  },
                },
                additionalProperties: false,
              },
              launchTemplate: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                  },
                  version: {
                    type: "string",
                  },
                  id: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              tags: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
              },
            },
            additionalProperties: false,
            description: "The full description of your new node group.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createNodegroup;
