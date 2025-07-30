import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, ModifyDBSnapshotCommand } from "@aws-sdk/client-rds";

const modifyDBSnapshot: AppBlock = {
  name: "Modify DB Snapshot",
  description: "Updates a manual DB snapshot with a new engine version.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DBSnapshotIdentifier: {
          name: "DB Snapshot Identifier",
          description: "The identifier of the DB snapshot to modify.",
          type: "string",
          required: true,
        },
        EngineVersion: {
          name: "Engine Version",
          description: "The engine version to upgrade the DB snapshot to.",
          type: "string",
          required: false,
        },
        OptionGroupName: {
          name: "Option Group Name",
          description:
            "The option group to identify with the upgraded DB snapshot.",
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

        const command = new ModifyDBSnapshotCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify DB Snapshot Result",
      description: "Result from ModifyDBSnapshot operation",
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

export default modifyDBSnapshot;
