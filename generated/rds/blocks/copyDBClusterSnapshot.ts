import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, CopyDBClusterSnapshotCommand } from "@aws-sdk/client-rds";

const copyDBClusterSnapshot: AppBlock = {
  name: "Copy DB Cluster Snapshot",
  description: "Copies a snapshot of a DB cluster.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        SourceDBClusterSnapshotIdentifier: {
          name: "Source DB Cluster Snapshot Identifier",
          description: "The identifier of the DB cluster snapshot to copy.",
          type: "string",
          required: true,
        },
        TargetDBClusterSnapshotIdentifier: {
          name: "Target DB Cluster Snapshot Identifier",
          description:
            "The identifier of the new DB cluster snapshot to create from the source DB cluster snapshot.",
          type: "string",
          required: true,
        },
        KmsKeyId: {
          name: "Kms Key Id",
          description:
            "The Amazon Web Services KMS key identifier for an encrypted DB cluster snapshot.",
          type: "string",
          required: false,
        },
        PreSignedUrl: {
          name: "Pre Signed Url",
          description:
            "When you are copying a DB cluster snapshot from one Amazon Web Services GovCloud (US) Region to another, the URL that contains a Signature Version 4 signed request for the CopyDBClusterSnapshot API operation in the Amazon Web Services Region that contains the source DB cluster snapshot to copy.",
          type: "string",
          required: false,
        },
        CopyTags: {
          name: "Copy Tags",
          description:
            "Specifies whether to copy all tags from the source DB cluster snapshot to the target DB cluster snapshot.",
          type: "boolean",
          required: false,
        },
        Tags: {
          name: "Tags",
          description: "A list of tags.",
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
        });

        const command = new CopyDBClusterSnapshotCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Copy DB Cluster Snapshot Result",
      description: "Result from CopyDBClusterSnapshot operation",
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

export default copyDBClusterSnapshot;
