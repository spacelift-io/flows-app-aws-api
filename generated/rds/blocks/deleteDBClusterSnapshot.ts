import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, DeleteDBClusterSnapshotCommand } from "@aws-sdk/client-rds";

const deleteDBClusterSnapshot: AppBlock = {
  name: "Delete DB Cluster Snapshot",
  description: "Deletes a DB cluster snapshot.",
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
          description: "The identifier of the DB cluster snapshot to delete.",
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

        const command = new DeleteDBClusterSnapshotCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete DB Cluster Snapshot Result",
      description: "Result from DeleteDBClusterSnapshot operation",
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

export default deleteDBClusterSnapshot;
