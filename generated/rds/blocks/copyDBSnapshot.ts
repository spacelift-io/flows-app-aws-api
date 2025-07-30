import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, CopyDBSnapshotCommand } from "@aws-sdk/client-rds";

const copyDBSnapshot: AppBlock = {
  name: "Copy DB Snapshot",
  description: "Copies the specified DB snapshot.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        SourceDBSnapshotIdentifier: {
          name: "Source DB Snapshot Identifier",
          description: "The identifier for the source DB snapshot.",
          type: "string",
          required: true,
        },
        TargetDBSnapshotIdentifier: {
          name: "Target DB Snapshot Identifier",
          description: "The identifier for the copy of the snapshot.",
          type: "string",
          required: true,
        },
        KmsKeyId: {
          name: "Kms Key Id",
          description:
            "The Amazon Web Services KMS key identifier for an encrypted DB snapshot.",
          type: "string",
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
        CopyTags: {
          name: "Copy Tags",
          description:
            "Specifies whether to copy all tags from the source DB snapshot to the target DB snapshot.",
          type: "boolean",
          required: false,
        },
        PreSignedUrl: {
          name: "Pre Signed Url",
          description:
            "When you are copying a snapshot from one Amazon Web Services GovCloud (US) Region to another, the URL that contains a Signature Version 4 signed request for the CopyDBSnapshot API operation in the source Amazon Web Services Region that contains the source DB snapshot to copy.",
          type: "string",
          required: false,
        },
        OptionGroupName: {
          name: "Option Group Name",
          description:
            "The name of an option group to associate with the copy of the snapshot.",
          type: "string",
          required: false,
        },
        TargetCustomAvailabilityZone: {
          name: "Target Custom Availability Zone",
          description:
            "The external custom Availability Zone (CAZ) identifier for the target CAZ.",
          type: "string",
          required: false,
        },
        CopyOptionGroup: {
          name: "Copy Option Group",
          description:
            "Specifies whether to copy the DB option group associated with the source DB snapshot to the target Amazon Web Services account and associate with the target DB snapshot.",
          type: "boolean",
          required: false,
        },
        SnapshotAvailabilityZone: {
          name: "Snapshot Availability Zone",
          description:
            "Specifies the name of the Availability Zone where RDS stores the DB snapshot.",
          type: "string",
          required: false,
        },
        SnapshotTarget: {
          name: "Snapshot Target",
          description:
            "Configures the location where RDS will store copied snapshots.",
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
        });

        const command = new CopyDBSnapshotCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Copy DB Snapshot Result",
      description: "Result from CopyDBSnapshot operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DBSnapshot: {
            type: "object",
            properties: {
              DBSnapshotIdentifier: {
                type: "string",
              },
              DBInstanceIdentifier: {
                type: "string",
              },
              SnapshotCreateTime: {
                type: "string",
              },
              Engine: {
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
              AvailabilityZone: {
                type: "string",
              },
              VpcId: {
                type: "string",
              },
              InstanceCreateTime: {
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
              Iops: {
                type: "number",
              },
              OptionGroupName: {
                type: "string",
              },
              PercentProgress: {
                type: "number",
              },
              SourceRegion: {
                type: "string",
              },
              SourceDBSnapshotIdentifier: {
                type: "string",
              },
              StorageType: {
                type: "string",
              },
              TdeCredentialArn: {
                type: "string",
              },
              Encrypted: {
                type: "boolean",
              },
              KmsKeyId: {
                type: "string",
              },
              DBSnapshotArn: {
                type: "string",
              },
              Timezone: {
                type: "string",
              },
              IAMDatabaseAuthenticationEnabled: {
                type: "boolean",
              },
              ProcessorFeatures: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Name: {
                      type: "string",
                    },
                    Value: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              DbiResourceId: {
                type: "string",
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
              OriginalSnapshotCreateTime: {
                type: "string",
              },
              SnapshotDatabaseTime: {
                type: "string",
              },
              SnapshotTarget: {
                type: "string",
              },
              StorageThroughput: {
                type: "number",
              },
              DBSystemId: {
                type: "string",
              },
              DedicatedLogVolume: {
                type: "boolean",
              },
              MultiTenant: {
                type: "boolean",
              },
              SnapshotAvailabilityZone: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "Contains the details of an Amazon RDS DB snapshot.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default copyDBSnapshot;
