import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, RemoveFromGlobalClusterCommand } from "@aws-sdk/client-rds";

const removeFromGlobalCluster: AppBlock = {
  name: "Remove From Global Cluster",
  description:
    "Detaches an Aurora secondary cluster from an Aurora global database cluster.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        GlobalClusterIdentifier: {
          name: "Global Cluster Identifier",
          description:
            "The cluster identifier to detach from the Aurora global database cluster.",
          type: "string",
          required: false,
        },
        DbClusterIdentifier: {
          name: "Db Cluster Identifier",
          description:
            "The Amazon Resource Name (ARN) identifying the cluster that was detached from the Aurora global database cluster.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new RDSClient({
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

        const command = new RemoveFromGlobalClusterCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Remove From Global Cluster Result",
      description: "Result from RemoveFromGlobalCluster operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          GlobalCluster: {
            type: "object",
            properties: {
              GlobalClusterIdentifier: {
                type: "string",
              },
              GlobalClusterResourceId: {
                type: "string",
              },
              GlobalClusterArn: {
                type: "string",
              },
              Status: {
                type: "string",
              },
              Engine: {
                type: "string",
              },
              EngineVersion: {
                type: "string",
              },
              EngineLifecycleSupport: {
                type: "string",
              },
              DatabaseName: {
                type: "string",
              },
              StorageEncrypted: {
                type: "boolean",
              },
              DeletionProtection: {
                type: "boolean",
              },
              GlobalClusterMembers: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    DBClusterArn: {
                      type: "string",
                    },
                    Readers: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    IsWriter: {
                      type: "boolean",
                    },
                    GlobalWriteForwardingStatus: {
                      type: "string",
                    },
                    SynchronizationStatus: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              Endpoint: {
                type: "string",
              },
              FailoverState: {
                type: "object",
                properties: {
                  Status: {
                    type: "string",
                  },
                  FromDbClusterArn: {
                    type: "string",
                  },
                  ToDbClusterArn: {
                    type: "string",
                  },
                  IsDataLossAllowed: {
                    type: "boolean",
                  },
                },
                additionalProperties: false,
              },
              TagList: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Key: {
                      type: "string",
                    },
                    Value: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
            },
            additionalProperties: false,
            description: "A data type representing an Aurora global database.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default removeFromGlobalCluster;
