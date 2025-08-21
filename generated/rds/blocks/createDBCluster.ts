import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, CreateDBClusterCommand } from "@aws-sdk/client-rds";

const createDBCluster: AppBlock = {
  name: "Create DB Cluster",
  description: "Creates a new Amazon Aurora DB cluster or Multi-AZ DB cluster.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        AvailabilityZones: {
          name: "Availability Zones",
          description:
            "A list of Availability Zones (AZs) where you specifically want to create DB instances in the DB cluster.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        BackupRetentionPeriod: {
          name: "Backup Retention Period",
          description:
            "The number of days for which automated backups are retained.",
          type: "number",
          required: false,
        },
        CharacterSetName: {
          name: "Character Set Name",
          description:
            "The name of the character set (CharacterSet) to associate the DB cluster with.",
          type: "string",
          required: false,
        },
        DatabaseName: {
          name: "Database Name",
          description:
            "The name for your database of up to 64 alphanumeric characters.",
          type: "string",
          required: false,
        },
        DBClusterIdentifier: {
          name: "DB Cluster Identifier",
          description: "The identifier for this DB cluster.",
          type: "string",
          required: true,
        },
        DBClusterParameterGroupName: {
          name: "DB Cluster Parameter Group Name",
          description:
            "The name of the DB cluster parameter group to associate with this DB cluster.",
          type: "string",
          required: false,
        },
        VpcSecurityGroupIds: {
          name: "Vpc Security Group Ids",
          description:
            "A list of EC2 VPC security groups to associate with this DB cluster.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        DBSubnetGroupName: {
          name: "DB Subnet Group Name",
          description: "A DB subnet group to associate with this DB cluster.",
          type: "string",
          required: false,
        },
        Engine: {
          name: "Engine",
          description: "The database engine to use for this DB cluster.",
          type: "string",
          required: true,
        },
        EngineVersion: {
          name: "Engine Version",
          description: "The version number of the database engine to use.",
          type: "string",
          required: false,
        },
        Port: {
          name: "Port",
          description:
            "The port number on which the instances in the DB cluster accept connections.",
          type: "number",
          required: false,
        },
        MasterUsername: {
          name: "Master Username",
          description: "The name of the master user for the DB cluster.",
          type: "string",
          required: false,
        },
        MasterUserPassword: {
          name: "Master User Password",
          description: "The password for the master database user.",
          type: "string",
          required: false,
        },
        OptionGroupName: {
          name: "Option Group Name",
          description: "The option group to associate the DB cluster with.",
          type: "string",
          required: false,
        },
        PreferredBackupWindow: {
          name: "Preferred Backup Window",
          description:
            "The daily time range during which automated backups are created if automated backups are enabled using the BackupRetentionPeriod parameter.",
          type: "string",
          required: false,
        },
        PreferredMaintenanceWindow: {
          name: "Preferred Maintenance Window",
          description:
            "The weekly time range during which system maintenance can occur.",
          type: "string",
          required: false,
        },
        ReplicationSourceIdentifier: {
          name: "Replication Source Identifier",
          description:
            "The Amazon Resource Name (ARN) of the source DB instance or DB cluster if this DB cluster is created as a read replica.",
          type: "string",
          required: false,
        },
        Tags: {
          name: "Tags",
          description: "Tags to assign to the DB cluster.",
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
        StorageEncrypted: {
          name: "Storage Encrypted",
          description: "Specifies whether the DB cluster is encrypted.",
          type: "boolean",
          required: false,
        },
        KmsKeyId: {
          name: "Kms Key Id",
          description:
            "The Amazon Web Services KMS key identifier for an encrypted DB cluster.",
          type: "string",
          required: false,
        },
        PreSignedUrl: {
          name: "Pre Signed Url",
          description:
            "When you are replicating a DB cluster from one Amazon Web Services GovCloud (US) Region to another, an URL that contains a Signature Version 4 signed request for the CreateDBCluster operation to be called in the source Amazon Web Services Region where the DB cluster is replicated from.",
          type: "string",
          required: false,
        },
        EnableIAMDatabaseAuthentication: {
          name: "Enable IAM Database Authentication",
          description:
            "Specifies whether to enable mapping of Amazon Web Services Identity and Access Management (IAM) accounts to database accounts.",
          type: "boolean",
          required: false,
        },
        BacktrackWindow: {
          name: "Backtrack Window",
          description: "The target backtrack window, in seconds.",
          type: "number",
          required: false,
        },
        EnableCloudwatchLogsExports: {
          name: "Enable Cloudwatch Logs Exports",
          description:
            "The list of log types that need to be enabled for exporting to CloudWatch Logs.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        EngineMode: {
          name: "Engine Mode",
          description:
            "The DB engine mode of the DB cluster, either provisioned or serverless.",
          type: "string",
          required: false,
        },
        ScalingConfiguration: {
          name: "Scaling Configuration",
          description:
            "For DB clusters in serverless DB engine mode, the scaling properties of the DB cluster.",
          type: {
            type: "object",
            properties: {
              MinCapacity: {
                type: "number",
              },
              MaxCapacity: {
                type: "number",
              },
              AutoPause: {
                type: "boolean",
              },
              SecondsUntilAutoPause: {
                type: "number",
              },
              TimeoutAction: {
                type: "string",
              },
              SecondsBeforeTimeout: {
                type: "number",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        RdsCustomClusterConfiguration: {
          name: "Rds Custom Cluster Configuration",
          description: "Reserved for future use.",
          type: {
            type: "object",
            properties: {
              InterconnectSubnetId: {
                type: "string",
              },
              TransitGatewayMulticastDomainId: {
                type: "string",
              },
              ReplicaMode: {
                type: "string",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        DeletionProtection: {
          name: "Deletion Protection",
          description:
            "Specifies whether the DB cluster has deletion protection enabled.",
          type: "boolean",
          required: false,
        },
        GlobalClusterIdentifier: {
          name: "Global Cluster Identifier",
          description:
            "The global cluster ID of an Aurora cluster that becomes the primary cluster in the new global database cluster.",
          type: "string",
          required: false,
        },
        EnableHttpEndpoint: {
          name: "Enable Http Endpoint",
          description:
            "Specifies whether to enable the HTTP endpoint for the DB cluster.",
          type: "boolean",
          required: false,
        },
        CopyTagsToSnapshot: {
          name: "Copy Tags To Snapshot",
          description:
            "Specifies whether to copy all tags from the DB cluster to snapshots of the DB cluster.",
          type: "boolean",
          required: false,
        },
        Domain: {
          name: "Domain",
          description:
            "The Active Directory directory ID to create the DB cluster in.",
          type: "string",
          required: false,
        },
        DomainIAMRoleName: {
          name: "Domain IAM Role Name",
          description:
            "The name of the IAM role to use when making API calls to the Directory Service.",
          type: "string",
          required: false,
        },
        EnableGlobalWriteForwarding: {
          name: "Enable Global Write Forwarding",
          description:
            "Specifies whether to enable this DB cluster to forward write operations to the primary cluster of a global cluster (Aurora global database).",
          type: "boolean",
          required: false,
        },
        DBClusterInstanceClass: {
          name: "DB Cluster Instance Class",
          description:
            "The compute and memory capacity of each DB instance in the Multi-AZ DB cluster, for example db.",
          type: "string",
          required: false,
        },
        AllocatedStorage: {
          name: "Allocated Storage",
          description:
            "The amount of storage in gibibytes (GiB) to allocate to each DB instance in the Multi-AZ DB cluster.",
          type: "number",
          required: false,
        },
        StorageType: {
          name: "Storage Type",
          description: "The storage type to associate with the DB cluster.",
          type: "string",
          required: false,
        },
        Iops: {
          name: "Iops",
          description:
            "The amount of Provisioned IOPS (input/output operations per second) to be initially allocated for each DB instance in the Multi-AZ DB cluster.",
          type: "number",
          required: false,
        },
        PubliclyAccessible: {
          name: "Publicly Accessible",
          description:
            "Specifies whether the DB cluster is publicly accessible.",
          type: "boolean",
          required: false,
        },
        AutoMinorVersionUpgrade: {
          name: "Auto Minor Version Upgrade",
          description:
            "Specifies whether minor engine upgrades are applied automatically to the DB cluster during the maintenance window.",
          type: "boolean",
          required: false,
        },
        MonitoringInterval: {
          name: "Monitoring Interval",
          description:
            "The interval, in seconds, between points when Enhanced Monitoring metrics are collected for the DB cluster.",
          type: "number",
          required: false,
        },
        MonitoringRoleArn: {
          name: "Monitoring Role Arn",
          description:
            "The Amazon Resource Name (ARN) for the IAM role that permits RDS to send Enhanced Monitoring metrics to Amazon CloudWatch Logs.",
          type: "string",
          required: false,
        },
        DatabaseInsightsMode: {
          name: "Database Insights Mode",
          description:
            "The mode of Database Insights to enable for the DB cluster.",
          type: "string",
          required: false,
        },
        EnablePerformanceInsights: {
          name: "Enable Performance Insights",
          description:
            "Specifies whether to turn on Performance Insights for the DB cluster.",
          type: "boolean",
          required: false,
        },
        PerformanceInsightsKMSKeyId: {
          name: "Performance Insights KMS Key Id",
          description:
            "The Amazon Web Services KMS key identifier for encryption of Performance Insights data.",
          type: "string",
          required: false,
        },
        PerformanceInsightsRetentionPeriod: {
          name: "Performance Insights Retention Period",
          description:
            "The number of days to retain Performance Insights data.",
          type: "number",
          required: false,
        },
        EnableLimitlessDatabase: {
          name: "Enable Limitless Database",
          description: "Specifies whether to enable Aurora Limitless Database.",
          type: "boolean",
          required: false,
        },
        ServerlessV2ScalingConfiguration: {
          name: "Serverless V2Scaling Configuration",
          description:
            "Contains the scaling configuration of an Aurora Serverless v2 DB cluster.",
          type: {
            type: "object",
            properties: {
              MinCapacity: {
                type: "number",
              },
              MaxCapacity: {
                type: "number",
              },
              SecondsUntilAutoPause: {
                type: "number",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        NetworkType: {
          name: "Network Type",
          description: "The network type of the DB cluster.",
          type: "string",
          required: false,
        },
        ClusterScalabilityType: {
          name: "Cluster Scalability Type",
          description:
            "Specifies the scalability mode of the Aurora DB cluster.",
          type: "string",
          required: false,
        },
        DBSystemId: {
          name: "DB System Id",
          description: "Reserved for future use.",
          type: "string",
          required: false,
        },
        ManageMasterUserPassword: {
          name: "Manage Master User Password",
          description:
            "Specifies whether to manage the master user password with Amazon Web Services Secrets Manager.",
          type: "boolean",
          required: false,
        },
        MasterUserSecretKmsKeyId: {
          name: "Master User Secret Kms Key Id",
          description:
            "The Amazon Web Services KMS key identifier to encrypt a secret that is automatically generated and managed in Amazon Web Services Secrets Manager.",
          type: "string",
          required: false,
        },
        EnableLocalWriteForwarding: {
          name: "Enable Local Write Forwarding",
          description:
            "Specifies whether read replicas can forward write operations to the writer DB instance in the DB cluster.",
          type: "boolean",
          required: false,
        },
        CACertificateIdentifier: {
          name: "CA Certificate Identifier",
          description:
            "The CA certificate identifier to use for the DB cluster's server certificate.",
          type: "string",
          required: false,
        },
        EngineLifecycleSupport: {
          name: "Engine Lifecycle Support",
          description: "The life cycle type for this DB cluster.",
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

        const command = new CreateDBClusterCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create DB Cluster Result",
      description: "Result from CreateDBCluster operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DBCluster: {
            type: "object",
            properties: {
              AllocatedStorage: {
                type: "number",
              },
              AvailabilityZones: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              BackupRetentionPeriod: {
                type: "number",
              },
              CharacterSetName: {
                type: "string",
              },
              DatabaseName: {
                type: "string",
              },
              DBClusterIdentifier: {
                type: "string",
              },
              DBClusterParameterGroup: {
                type: "string",
              },
              DBSubnetGroup: {
                type: "string",
              },
              Status: {
                type: "string",
              },
              AutomaticRestartTime: {
                type: "string",
              },
              PercentProgress: {
                type: "string",
              },
              EarliestRestorableTime: {
                type: "string",
              },
              Endpoint: {
                type: "string",
              },
              ReaderEndpoint: {
                type: "string",
              },
              CustomEndpoints: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              MultiAZ: {
                type: "boolean",
              },
              Engine: {
                type: "string",
              },
              EngineVersion: {
                type: "string",
              },
              LatestRestorableTime: {
                type: "string",
              },
              Port: {
                type: "number",
              },
              MasterUsername: {
                type: "string",
              },
              DBClusterOptionGroupMemberships: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    DBClusterOptionGroupName: {
                      type: "string",
                    },
                    Status: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              PreferredBackupWindow: {
                type: "string",
              },
              PreferredMaintenanceWindow: {
                type: "string",
              },
              ReplicationSourceIdentifier: {
                type: "string",
              },
              ReadReplicaIdentifiers: {
                type: "array",
                items: {
                  type: "string",
                },
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
              DBClusterMembers: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    DBInstanceIdentifier: {
                      type: "string",
                    },
                    IsClusterWriter: {
                      type: "boolean",
                    },
                    DBClusterParameterGroupStatus: {
                      type: "string",
                    },
                    PromotionTier: {
                      type: "number",
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
              HostedZoneId: {
                type: "string",
              },
              StorageEncrypted: {
                type: "boolean",
              },
              KmsKeyId: {
                type: "string",
              },
              DbClusterResourceId: {
                type: "string",
              },
              DBClusterArn: {
                type: "string",
              },
              AssociatedRoles: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    RoleArn: {
                      type: "string",
                    },
                    Status: {
                      type: "string",
                    },
                    FeatureName: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              IAMDatabaseAuthenticationEnabled: {
                type: "boolean",
              },
              CloneGroupId: {
                type: "string",
              },
              ClusterCreateTime: {
                type: "string",
              },
              EarliestBacktrackTime: {
                type: "string",
              },
              BacktrackWindow: {
                type: "number",
              },
              BacktrackConsumedChangeRecords: {
                type: "number",
              },
              EnabledCloudwatchLogsExports: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              Capacity: {
                type: "number",
              },
              EngineMode: {
                type: "string",
              },
              ScalingConfigurationInfo: {
                type: "object",
                properties: {
                  MinCapacity: {
                    type: "number",
                  },
                  MaxCapacity: {
                    type: "number",
                  },
                  AutoPause: {
                    type: "boolean",
                  },
                  SecondsUntilAutoPause: {
                    type: "number",
                  },
                  TimeoutAction: {
                    type: "string",
                  },
                  SecondsBeforeTimeout: {
                    type: "number",
                  },
                },
                additionalProperties: false,
              },
              RdsCustomClusterConfiguration: {
                type: "object",
                properties: {
                  InterconnectSubnetId: {
                    type: "string",
                  },
                  TransitGatewayMulticastDomainId: {
                    type: "string",
                  },
                  ReplicaMode: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              DeletionProtection: {
                type: "boolean",
              },
              HttpEndpointEnabled: {
                type: "boolean",
              },
              ActivityStreamMode: {
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
              CopyTagsToSnapshot: {
                type: "boolean",
              },
              CrossAccountClone: {
                type: "boolean",
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
              GlobalClusterIdentifier: {
                type: "string",
              },
              GlobalWriteForwardingStatus: {
                type: "string",
              },
              GlobalWriteForwardingRequested: {
                type: "boolean",
              },
              PendingModifiedValues: {
                type: "object",
                properties: {
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
                  DBClusterIdentifier: {
                    type: "string",
                  },
                  MasterUserPassword: {
                    type: "string",
                  },
                  IAMDatabaseAuthenticationEnabled: {
                    type: "boolean",
                  },
                  EngineVersion: {
                    type: "string",
                  },
                  BackupRetentionPeriod: {
                    type: "number",
                  },
                  AllocatedStorage: {
                    type: "number",
                  },
                  RdsCustomClusterConfiguration: {
                    type: "object",
                    properties: {
                      InterconnectSubnetId: {
                        type: "string",
                      },
                      TransitGatewayMulticastDomainId: {
                        type: "string",
                      },
                      ReplicaMode: {
                        type: "string",
                      },
                    },
                    additionalProperties: false,
                  },
                  Iops: {
                    type: "number",
                  },
                  StorageType: {
                    type: "string",
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
                },
                additionalProperties: false,
              },
              DBClusterInstanceClass: {
                type: "string",
              },
              StorageType: {
                type: "string",
              },
              Iops: {
                type: "number",
              },
              PubliclyAccessible: {
                type: "boolean",
              },
              AutoMinorVersionUpgrade: {
                type: "boolean",
              },
              MonitoringInterval: {
                type: "number",
              },
              MonitoringRoleArn: {
                type: "string",
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
              ServerlessV2ScalingConfiguration: {
                type: "object",
                properties: {
                  MinCapacity: {
                    type: "number",
                  },
                  MaxCapacity: {
                    type: "number",
                  },
                  SecondsUntilAutoPause: {
                    type: "number",
                  },
                },
                additionalProperties: false,
              },
              NetworkType: {
                type: "string",
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
              IOOptimizedNextAllowedModificationTime: {
                type: "string",
              },
              LocalWriteForwardingStatus: {
                type: "string",
              },
              AwsBackupRecoveryPointArn: {
                type: "string",
              },
              LimitlessDatabase: {
                type: "object",
                properties: {
                  Status: {
                    type: "string",
                  },
                  MinRequiredACU: {
                    type: "number",
                  },
                },
                additionalProperties: false,
              },
              StorageThroughput: {
                type: "number",
              },
              ClusterScalabilityType: {
                type: "string",
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
              EngineLifecycleSupport: {
                type: "string",
              },
            },
            additionalProperties: false,
            description:
              "Contains the details of an Amazon Aurora DB cluster or Multi-AZ DB cluster.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createDBCluster;
