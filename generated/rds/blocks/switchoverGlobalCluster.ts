import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, SwitchoverGlobalClusterCommand } from "@aws-sdk/client-rds";

const switchoverGlobalCluster: AppBlock = {
  name: "Switchover Global Cluster",
  description:
    "Switches over the specified secondary DB cluster to be the new primary DB cluster in the global database cluster.",
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
            "The identifier of the global database cluster to switch over.",
          type: "string",
          required: true,
        },
        TargetDbClusterIdentifier: {
          name: "Target Db Cluster Identifier",
          description:
            "The identifier of the secondary Aurora DB cluster to promote to the new primary for the global database cluster.",
          type: "string",
          required: true,
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

        const command = new SwitchoverGlobalClusterCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Switchover Global Cluster Result",
      description: "Result from SwitchoverGlobalCluster operation",
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

export default switchoverGlobalCluster;
