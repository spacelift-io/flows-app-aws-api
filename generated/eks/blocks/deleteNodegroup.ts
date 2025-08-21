import { AppBlock, events } from "@slflows/sdk/v1";
import { EKSClient, DeleteNodegroupCommand } from "@aws-sdk/client-eks";

const deleteNodegroup: AppBlock = {
  name: "Delete Nodegroup",
  description: "Deletes a managed node group.",
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
          description: "The name of the node group to delete.",
          type: "string",
          required: true,
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

        const command = new DeleteNodegroupCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Nodegroup Result",
      description: "Result from DeleteNodegroup operation",
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
            description: "The full description of your deleted node group.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteNodegroup;
