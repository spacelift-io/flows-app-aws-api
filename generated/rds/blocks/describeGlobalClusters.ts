import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, DescribeGlobalClustersCommand } from "@aws-sdk/client-rds";

const describeGlobalClusters: AppBlock = {
  name: "Describe Global Clusters",
  description: "Returns information about Aurora global database clusters.",
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
          description: "The user-supplied DB cluster identifier.",
          type: "string",
          required: false,
        },
        Filters: {
          name: "Filters",
          description:
            "A filter that specifies one or more global database clusters to describe.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: {
                  type: "string",
                },
                Values: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              required: ["Name", "Values"],
              additionalProperties: false,
            },
          },
          required: false,
        },
        MaxRecords: {
          name: "Max Records",
          description:
            "The maximum number of records to include in the response.",
          type: "number",
          required: false,
        },
        Marker: {
          name: "Marker",
          description:
            "An optional pagination token provided by a previous DescribeGlobalClusters request.",
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

        const command = new DescribeGlobalClustersCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Global Clusters Result",
      description: "Result from DescribeGlobalClusters operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Marker: {
            type: "string",
            description:
              "An optional pagination token provided by a previous DescribeGlobalClusters request.",
          },
          GlobalClusters: {
            type: "array",
            items: {
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
                        type: "object",
                        additionalProperties: true,
                      },
                      Readers: {
                        type: "object",
                        additionalProperties: true,
                      },
                      IsWriter: {
                        type: "object",
                        additionalProperties: true,
                      },
                      GlobalWriteForwardingStatus: {
                        type: "object",
                        additionalProperties: true,
                      },
                      SynchronizationStatus: {
                        type: "object",
                        additionalProperties: true,
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
                        type: "object",
                        additionalProperties: true,
                      },
                      Value: {
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
            description:
              "The list of global clusters returned by this request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeGlobalClusters;
