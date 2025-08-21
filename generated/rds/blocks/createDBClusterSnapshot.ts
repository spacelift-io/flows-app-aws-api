import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, CreateDBClusterSnapshotCommand } from "@aws-sdk/client-rds";

const createDBClusterSnapshot: AppBlock = {
  name: "Create DB Cluster Snapshot",
  description: "Creates a snapshot of a DB cluster.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DBClusterSnapshotIdentifier: {
          name: "DB Cluster Snapshot Identifier",
          description: "The identifier of the DB cluster snapshot.",
          type: "string",
          required: true,
        },
        DBClusterIdentifier: {
          name: "DB Cluster Identifier",
          description:
            "The identifier of the DB cluster to create a snapshot for.",
          type: "string",
          required: true,
        },
        Tags: {
          name: "Tags",
          description: "The tags to be assigned to the DB cluster snapshot.",
          type: {
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

        const command = new CreateDBClusterSnapshotCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create DB Cluster Snapshot Result",
      description: "Result from CreateDBClusterSnapshot operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DBClusterSnapshot: {
            type: "object",
            properties: {
              AvailabilityZones: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              DBClusterSnapshotIdentifier: {
                type: "string",
              },
              DBClusterIdentifier: {
                type: "string",
              },
              SnapshotCreateTime: {
                type: "string",
              },
              Engine: {
                type: "string",
              },
              EngineMode: {
                type: "string",
              },
              AllocatedStorage: {
                type: "number",
              },
              Status: {
                type: "string",
              },
              Port: {
                type: "number",
              },
              VpcId: {
                type: "string",
              },
              ClusterCreateTime: {
                type: "string",
              },
              MasterUsername: {
                type: "string",
              },
              EngineVersion: {
                type: "string",
              },
              LicenseModel: {
                type: "string",
              },
              SnapshotType: {
                type: "string",
              },
              PercentProgress: {
                type: "number",
              },
              StorageEncrypted: {
                type: "boolean",
              },
              KmsKeyId: {
                type: "string",
              },
              DBClusterSnapshotArn: {
                type: "string",
              },
              SourceDBClusterSnapshotArn: {
                type: "string",
              },
              IAMDatabaseAuthenticationEnabled: {
                type: "boolean",
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
              DBSystemId: {
                type: "string",
              },
              StorageType: {
                type: "string",
              },
              DbClusterResourceId: {
                type: "string",
              },
              StorageThroughput: {
                type: "number",
              },
            },
            additionalProperties: false,
            description:
              "Contains the details for an Amazon RDS DB cluster snapshot This data type is used as a response element in the DescribeDBClusterSnapshots action.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createDBClusterSnapshot;
