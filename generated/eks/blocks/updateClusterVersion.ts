import { AppBlock, events } from "@slflows/sdk/v1";
import { EKSClient, UpdateClusterVersionCommand } from "@aws-sdk/client-eks";

const updateClusterVersion: AppBlock = {
  name: "Update Cluster Version",
  description:
    "Updates an Amazon EKS cluster to the specified Kubernetes version.",
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
        version: {
          name: "version",
          description:
            "The desired Kubernetes version following a successful update.",
          type: "string",
          required: true,
        },
        clientRequestToken: {
          name: "client Request Token",
          description:
            "A unique, case-sensitive identifier that you provide to ensure the idempotency of the request.",
          type: "string",
          required: false,
        },
        force: {
          name: "force",
          description:
            "Set this value to true to override upgrade-blocking readiness checks when updating a cluster.",
          type: "boolean",
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

        const command = new UpdateClusterVersionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Cluster Version Result",
      description: "Result from UpdateClusterVersion operation",
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
            description: "The full description of the specified update",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateClusterVersion;
