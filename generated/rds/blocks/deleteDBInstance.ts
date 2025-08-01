import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, DeleteDBInstanceCommand } from "@aws-sdk/client-rds";

const deleteDBInstance: AppBlock = {
  name: "Delete DB Instance",
  description: "Deletes a previously provisioned DB instance.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DBInstanceIdentifier: {
          name: "DB Instance Identifier",
          description:
            "The DB instance identifier for the DB instance to be deleted.",
          type: "string",
          required: true,
        },
        SkipFinalSnapshot: {
          name: "Skip Final Snapshot",
          description:
            "Specifies whether to skip the creation of a final DB snapshot before deleting the instance.",
          type: "boolean",
          required: false,
        },
        FinalDBSnapshotIdentifier: {
          name: "Final DB Snapshot Identifier",
          description:
            "The DBSnapshotIdentifier of the new DBSnapshot created when the SkipFinalSnapshot parameter is disabled.",
          type: "string",
          required: false,
        },
        DeleteAutomatedBackups: {
          name: "Delete Automated Backups",
          description:
            "Specifies whether to remove automated backups immediately after the DB instance is deleted.",
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

        const command = new DeleteDBInstanceCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete DB Instance Result",
      description: "Result from DeleteDBInstance operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DBInstance: {
            type: "object",
            properties: {
              DBInstanceIdentifier: {
                type: "string",
              },
              DBInstanceClass: {
                type: "string",
              },
              Engine: {
                type: "string",
              },
              DBInstanceStatus: {
                type: "string",
              },
              AutomaticRestartTime: {
                type: "string",
              },
              MasterUsername: {
                type: "string",
              },
              DBName: {
                type: "string",
              },
              Endpoint: {
                type: "object",
                properties: {
                  Address: {
                    type: "string",
                  },
                  Port: {
                    type: "number",
                  },
                  HostedZoneId: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              AllocatedStorage: {
                type: "number",
              },
              InstanceCreateTime: {
                type: "string",
              },
              PreferredBackupWindow: {
                type: "string",
              },
              BackupRetentionPeriod: {
                type: "number",
              },
              DBSecurityGroups: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    DBSecurityGroupName: {
                      type: "string",
                    },
                    Status: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              VpcSecurityGroups: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    VpcSecurityGroupId: {
                      type: "string",
                    },
                    Status: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              DBParameterGroups: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    DBParameterGroupName: {
                      type: "string",
                    },
                    ParameterApplyStatus: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              AvailabilityZone: {
                type: "string",
              },
              DBSubnetGroup: {
                type: "object",
                properties: {
                  DBSubnetGroupName: {
                    type: "string",
                  },
                  DBSubnetGroupDescription: {
                    type: "string",
                  },
                  VpcId: {
                    type: "string",
                  },
                  SubnetGroupStatus: {
                    type: "string",
                  },
                  Subnets: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        SubnetIdentifier: {
                          type: "object",
                          additionalProperties: true,
                        },
                        SubnetAvailabilityZone: {
                          type: "object",
                          additionalProperties: true,
                        },
                        SubnetOutpost: {
                          type: "object",
                          additionalProperties: true,
                        },
                        SubnetStatus: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                  DBSubnetGroupArn: {
                    type: "string",
                  },
                  SupportedNetworkTypes: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                },
                additionalProperties: false,
              },
              PreferredMaintenanceWindow: {
                type: "string",
              },
              PendingModifiedValues: {
                type: "object",
                properties: {
                  DBInstanceClass: {
                    type: "string",
                  },
                  AllocatedStorage: {
                    type: "number",
                  },
                  MasterUserPassword: {
                    type: "string",
                  },
                  Port: {
                    type: "number",
                  },
                  BackupRetentionPeriod: {
                    type: "number",
                  },
                  MultiAZ: {
                    type: "boolean",
                  },
                  EngineVersion: {
                    type: "string",
                  },
                  LicenseModel: {
                    type: "string",
                  },
                  Iops: {
                    type: "number",
                  },
                  DBInstanceIdentifier: {
                    type: "string",
                  },
                  StorageType: {
                    type: "string",
                  },
                  CACertificateIdentifier: {
                    type: "string",
                  },
                  DBSubnetGroupName: {
                    type: "string",
                  },
                  PendingCloudwatchLogsExports: {
                    type: "object",
                    properties: {
                      LogTypesToEnable: {
                        type: "array",
                        items: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      LogTypesToDisable: {
                        type: "array",
                        items: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                    },
                    additionalProperties: false,
                  },
                  ProcessorFeatures: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        Name: {
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
                  IAMDatabaseAuthenticationEnabled: {
                    type: "boolean",
                  },
                  AutomationMode: {
                    type: "string",
                  },
                  ResumeFullAutomationModeTime: {
                    type: "string",
                  },
                  StorageThroughput: {
                    type: "number",
                  },
                  Engine: {
                    type: "string",
                  },
                  DedicatedLogVolume: {
                    type: "boolean",
                  },
                  MultiTenant: {
                    type: "boolean",
                  },
                },
                additionalProperties: false,
              },
              LatestRestorableTime: {
                type: "string",
              },
              MultiAZ: {
                type: "boolean",
              },
              EngineVersion: {
                type: "string",
              },
              AutoMinorVersionUpgrade: {
                type: "boolean",
              },
              ReadReplicaSourceDBInstanceIdentifier: {
                type: "string",
              },
              ReadReplicaDBInstanceIdentifiers: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              ReadReplicaDBClusterIdentifiers: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              ReplicaMode: {
                type: "string",
              },
              LicenseModel: {
                type: "string",
              },
              Iops: {
                type: "number",
              },
              OptionGroupMemberships: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    OptionGroupName: {
                      type: "string",
                    },
                    Status: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              CharacterSetName: {
                type: "string",
              },
              NcharCharacterSetName: {
                type: "string",
              },
              SecondaryAvailabilityZone: {
                type: "string",
              },
              PubliclyAccessible: {
                type: "boolean",
              },
              StatusInfos: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    StatusType: {
                      type: "string",
                    },
                    Normal: {
                      type: "boolean",
                    },
                    Status: {
                      type: "string",
                    },
                    Message: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              StorageType: {
                type: "string",
              },
              TdeCredentialArn: {
                type: "string",
              },
              DbInstancePort: {
                type: "number",
              },
              DBClusterIdentifier: {
                type: "string",
              },
              StorageEncrypted: {
                type: "boolean",
              },
              KmsKeyId: {
                type: "string",
              },
              DbiResourceId: {
                type: "string",
              },
              CACertificateIdentifier: {
                type: "string",
              },
              DomainMemberships: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Domain: {
                      type: "string",
                    },
                    Status: {
                      type: "string",
                    },
                    FQDN: {
                      type: "string",
                    },
                    IAMRoleName: {
                      type: "string",
                    },
                    OU: {
                      type: "string",
                    },
                    AuthSecretArn: {
                      type: "string",
                    },
                    DnsIps: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                  },
                  additionalProperties: false,
                },
              },
              CopyTagsToSnapshot: {
                type: "boolean",
              },
              MonitoringInterval: {
                type: "number",
              },
              EnhancedMonitoringResourceArn: {
                type: "string",
              },
              MonitoringRoleArn: {
                type: "string",
              },
              PromotionTier: {
                type: "number",
              },
              DBInstanceArn: {
                type: "string",
              },
              Timezone: {
                type: "string",
              },
              IAMDatabaseAuthenticationEnabled: {
                type: "boolean",
              },
              DatabaseInsightsMode: {
                type: "string",
              },
              PerformanceInsightsEnabled: {
                type: "boolean",
              },
              PerformanceInsightsKMSKeyId: {
                type: "string",
              },
              PerformanceInsightsRetentionPeriod: {
                type: "number",
              },
              EnabledCloudwatchLogsExports: {
                type: "array",
                items: {
                  type: "string",
                },
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
              DeletionProtection: {
                type: "boolean",
              },
              AssociatedRoles: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    RoleArn: {
                      type: "string",
                    },
                    FeatureName: {
                      type: "string",
                    },
                    Status: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              ListenerEndpoint: {
                type: "object",
                properties: {
                  Address: {
                    type: "string",
                  },
                  Port: {
                    type: "number",
                  },
                  HostedZoneId: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              MaxAllocatedStorage: {
                type: "number",
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
              DBInstanceAutomatedBackupsReplications: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    DBInstanceAutomatedBackupsArn: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              CustomerOwnedIpEnabled: {
                type: "boolean",
              },
              AwsBackupRecoveryPointArn: {
                type: "string",
              },
              ActivityStreamStatus: {
                type: "string",
              },
              ActivityStreamKmsKeyId: {
                type: "string",
              },
              ActivityStreamKinesisStreamName: {
                type: "string",
              },
              ActivityStreamMode: {
                type: "string",
              },
              ActivityStreamEngineNativeAuditFieldsIncluded: {
                type: "boolean",
              },
              AutomationMode: {
                type: "string",
              },
              ResumeFullAutomationModeTime: {
                type: "string",
              },
              CustomIamInstanceProfile: {
                type: "string",
              },
              BackupTarget: {
                type: "string",
              },
              NetworkType: {
                type: "string",
              },
              ActivityStreamPolicyStatus: {
                type: "string",
              },
              StorageThroughput: {
                type: "number",
              },
              DBSystemId: {
                type: "string",
              },
              MasterUserSecret: {
                type: "object",
                properties: {
                  SecretArn: {
                    type: "string",
                  },
                  SecretStatus: {
                    type: "string",
                  },
                  KmsKeyId: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              CertificateDetails: {
                type: "object",
                properties: {
                  CAIdentifier: {
                    type: "string",
                  },
                  ValidTill: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              ReadReplicaSourceDBClusterIdentifier: {
                type: "string",
              },
              PercentProgress: {
                type: "string",
              },
              DedicatedLogVolume: {
                type: "boolean",
              },
              IsStorageConfigUpgradeAvailable: {
                type: "boolean",
              },
              MultiTenant: {
                type: "boolean",
              },
              EngineLifecycleSupport: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "Contains the details of an Amazon RDS DB instance.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteDBInstance;
