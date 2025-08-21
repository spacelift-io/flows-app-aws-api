import { AppBlock, events } from "@slflows/sdk/v1";
import { EKSClient, UpdateNodegroupVersionCommand } from "@aws-sdk/client-eks";

const updateNodegroupVersion: AppBlock = {
  name: "Update Nodegroup Version",
  description:
    "Updates the Kubernetes version or AMI version of an Amazon EKS managed node group.",
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
          description: "The name of the managed node group to update.",
          type: "string",
          required: true,
        },
        version: {
          name: "version",
          description: "The Kubernetes version to update to.",
          type: "string",
          required: false,
        },
        releaseVersion: {
          name: "release Version",
          description:
            "The AMI version of the Amazon EKS optimized AMI to use for the update.",
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
        force: {
          name: "force",
          description:
            "Force the update if any Pod on the existing node group can't be drained due to a Pod disruption budget issue.",
          type: "boolean",
          required: false,
        },
        clientRequestToken: {
          name: "client Request Token",
          description:
            "A unique, case-sensitive identifier that you provide to ensure the idempotency of the request.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new UpdateNodegroupVersionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Nodegroup Version Result",
      description: "Result from UpdateNodegroupVersion operation",
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

export default updateNodegroupVersion;
