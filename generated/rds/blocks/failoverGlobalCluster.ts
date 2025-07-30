import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, FailoverGlobalClusterCommand } from "@aws-sdk/client-rds";

const failoverGlobalCluster: AppBlock = {
  name: "Failover Global Cluster",
  description:
    "Promotes the specified secondary DB cluster to be the primary DB cluster in the global database cluster to fail over or switch over a global database.",
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
            "The identifier of the global database cluster (Aurora global database) this operation should apply to.",
          type: "string",
          required: true,
        },
        TargetDbClusterIdentifier: {
          name: "Target Db Cluster Identifier",
          description:
            "The identifier of the secondary Aurora DB cluster that you want to promote to the primary for the global database cluster.",
          type: "string",
          required: true,
        },
        AllowDataLoss: {
          name: "Allow Data Loss",
          description:
            "Specifies whether to allow data loss for this global database cluster operation.",
          type: "boolean",
          required: false,
        },
        Switchover: {
          name: "Switchover",
          description:
            "Specifies whether to switch over this global database cluster.",
          type: "boolean",
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
        });

        const command = new FailoverGlobalClusterCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Failover Global Cluster Result",
      description: "Result from FailoverGlobalCluster operation",
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

export default failoverGlobalCluster;
