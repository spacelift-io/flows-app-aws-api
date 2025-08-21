import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, DeleteDBSnapshotCommand } from "@aws-sdk/client-rds";

const deleteDBSnapshot: AppBlock = {
  name: "Delete DB Snapshot",
  description: "Deletes a DB snapshot.",
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
          description: "The DB snapshot identifier.",
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

        const command = new DeleteDBSnapshotCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete DB Snapshot Result",
      description: "Result from DeleteDBSnapshot operation",
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

export default deleteDBSnapshot;
