import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, CreateLaunchTemplateCommand } from "@aws-sdk/client-ec2";

const createLaunchTemplate: AppBlock = {
  name: "Create Launch Template",
  description: "Creates a launch template.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the action, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
        },
        ClientToken: {
          name: "Client Token",
          description:
            "Unique, case-sensitive identifier you provide to ensure the idempotency of the request.",
          type: "string",
          required: false,
        },
        LaunchTemplateName: {
          name: "Launch Template Name",
          description: "A name for the launch template.",
          type: "string",
          required: true,
        },
        VersionDescription: {
          name: "Version Description",
          description:
            "A description for the first version of the launch template.",
          type: "string",
          required: false,
        },
        LaunchTemplateData: {
          name: "Launch Template Data",
          description: "The information for the launch template.",
          type: {
            type: "object",
            properties: {
              KernelId: {
                type: "string",
              },
              EbsOptimized: {
                type: "boolean",
              },
              IamInstanceProfile: {
                type: "object",
                properties: {
                  Arn: {
                    type: "string",
                  },
                  Name: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              BlockDeviceMappings: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    DeviceName: {
                      type: "string",
                    },
                    VirtualName: {
                      type: "string",
                    },
                    Ebs: {
                      type: "object",
                      properties: {
                        Encrypted: {
                          type: "object",
                          additionalProperties: true,
                        },
                        DeleteOnTermination: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Iops: {
                          type: "object",
                          additionalProperties: true,
                        },
                        KmsKeyId: {
                          type: "object",
                          additionalProperties: true,
                        },
                        SnapshotId: {
                          type: "object",
                          additionalProperties: true,
                        },
                        VolumeSize: {
                          type: "object",
                          additionalProperties: true,
                        },
                        VolumeType: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Throughput: {
                          type: "object",
                          additionalProperties: true,
                        },
                        VolumeInitializationRate: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                    NoDevice: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              NetworkInterfaces: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    AssociateCarrierIpAddress: {
                      type: "boolean",
                    },
                    AssociatePublicIpAddress: {
                      type: "boolean",
                    },
                    DeleteOnTermination: {
                      type: "boolean",
                    },
                    Description: {
                      type: "string",
                    },
                    DeviceIndex: {
                      type: "number",
                    },
                    Groups: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    InterfaceType: {
                      type: "string",
                    },
                    Ipv6AddressCount: {
                      type: "number",
                    },
                    Ipv6Addresses: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    NetworkInterfaceId: {
                      type: "string",
                    },
                    PrivateIpAddress: {
                      type: "string",
                    },
                    PrivateIpAddresses: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    SecondaryPrivateIpAddressCount: {
                      type: "number",
                    },
                    SubnetId: {
                      type: "string",
                    },
                    NetworkCardIndex: {
                      type: "number",
                    },
                    Ipv4Prefixes: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    Ipv4PrefixCount: {
                      type: "number",
                    },
                    Ipv6Prefixes: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    Ipv6PrefixCount: {
                      type: "number",
                    },
                    PrimaryIpv6: {
                      type: "boolean",
                    },
                    EnaSrdSpecification: {
                      type: "object",
                      properties: {
                        EnaSrdEnabled: {
                          type: "object",
                          additionalProperties: true,
                        },
                        EnaSrdUdpSpecification: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                    ConnectionTrackingSpecification: {
                      type: "object",
                      properties: {
                        TcpEstablishedTimeout: {
                          type: "object",
                          additionalProperties: true,
                        },
                        UdpStreamTimeout: {
                          type: "object",
                          additionalProperties: true,
                        },
                        UdpTimeout: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                    EnaQueueCount: {
                      type: "number",
                    },
                  },
                  additionalProperties: false,
                },
              },
              ImageId: {
                type: "string",
              },
              InstanceType: {
                type: "string",
              },
              KeyName: {
                type: "string",
              },
              Monitoring: {
                type: "object",
                properties: {
                  Enabled: {
                    type: "boolean",
                  },
                },
                additionalProperties: false,
              },
              Placement: {
                type: "object",
                properties: {
                  AvailabilityZone: {
                    type: "string",
                  },
                  Affinity: {
                    type: "string",
                  },
                  GroupName: {
                    type: "string",
                  },
                  HostId: {
                    type: "string",
                  },
                  Tenancy: {
                    type: "string",
                  },
                  SpreadDomain: {
                    type: "string",
                  },
                  HostResourceGroupArn: {
                    type: "string",
                  },
                  PartitionNumber: {
                    type: "number",
                  },
                  GroupId: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              RamDiskId: {
                type: "string",
              },
              DisableApiTermination: {
                type: "boolean",
              },
              InstanceInitiatedShutdownBehavior: {
                type: "string",
              },
              UserData: {
                type: "string",
              },
              TagSpecifications: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    ResourceType: {
                      type: "string",
                    },
                    Tags: {
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
              ElasticGpuSpecifications: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Type: {
                      type: "string",
                    },
                  },
                  required: ["Type"],
                  additionalProperties: false,
                },
              },
              ElasticInferenceAccelerators: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Type: {
                      type: "string",
                    },
                    Count: {
                      type: "number",
                    },
                  },
                  required: ["Type"],
                  additionalProperties: false,
                },
              },
              SecurityGroupIds: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              SecurityGroups: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              InstanceMarketOptions: {
                type: "object",
                properties: {
                  MarketType: {
                    type: "string",
                  },
                  SpotOptions: {
                    type: "object",
                    properties: {
                      MaxPrice: {
                        type: "string",
                      },
                      SpotInstanceType: {
                        type: "string",
                      },
                      BlockDurationMinutes: {
                        type: "number",
                      },
                      ValidUntil: {
                        type: "string",
                      },
                      InstanceInterruptionBehavior: {
                        type: "string",
                      },
                    },
                    additionalProperties: false,
                  },
                },
                additionalProperties: false,
              },
              CreditSpecification: {
                type: "object",
                properties: {
                  CpuCredits: {
                    type: "string",
                  },
                },
                required: ["CpuCredits"],
                additionalProperties: false,
              },
              CpuOptions: {
                type: "object",
                properties: {
                  CoreCount: {
                    type: "number",
                  },
                  ThreadsPerCore: {
                    type: "number",
                  },
                  AmdSevSnp: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              CapacityReservationSpecification: {
                type: "object",
                properties: {
                  CapacityReservationPreference: {
                    type: "string",
                  },
                  CapacityReservationTarget: {
                    type: "object",
                    properties: {
                      CapacityReservationId: {
                        type: "string",
                      },
                      CapacityReservationResourceGroupArn: {
                        type: "string",
                      },
                    },
                    additionalProperties: false,
                  },
                },
                additionalProperties: false,
              },
              LicenseSpecifications: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    LicenseConfigurationArn: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              HibernationOptions: {
                type: "object",
                properties: {
                  Configured: {
                    type: "boolean",
                  },
                },
                additionalProperties: false,
              },
              MetadataOptions: {
                type: "object",
                properties: {
                  HttpTokens: {
                    type: "string",
                  },
                  HttpPutResponseHopLimit: {
                    type: "number",
                  },
                  HttpEndpoint: {
                    type: "string",
                  },
                  HttpProtocolIpv6: {
                    type: "string",
                  },
                  InstanceMetadataTags: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              EnclaveOptions: {
                type: "object",
                properties: {
                  Enabled: {
                    type: "boolean",
                  },
                },
                additionalProperties: false,
              },
              InstanceRequirements: {
                type: "object",
                properties: {
                  VCpuCount: {
                    type: "object",
                    properties: {
                      Min: {
                        type: "number",
                      },
                      Max: {
                        type: "number",
                      },
                    },
                    required: ["Min"],
                    additionalProperties: false,
                  },
                  MemoryMiB: {
                    type: "object",
                    properties: {
                      Min: {
                        type: "number",
                      },
                      Max: {
                        type: "number",
                      },
                    },
                    required: ["Min"],
                    additionalProperties: false,
                  },
                  CpuManufacturers: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  MemoryGiBPerVCpu: {
                    type: "object",
                    properties: {
                      Min: {
                        type: "number",
                      },
                      Max: {
                        type: "number",
                      },
                    },
                    additionalProperties: false,
                  },
                  ExcludedInstanceTypes: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  InstanceGenerations: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  SpotMaxPricePercentageOverLowestPrice: {
                    type: "number",
                  },
                  OnDemandMaxPricePercentageOverLowestPrice: {
                    type: "number",
                  },
                  BareMetal: {
                    type: "string",
                  },
                  BurstablePerformance: {
                    type: "string",
                  },
                  RequireHibernateSupport: {
                    type: "boolean",
                  },
                  NetworkInterfaceCount: {
                    type: "object",
                    properties: {
                      Min: {
                        type: "number",
                      },
                      Max: {
                        type: "number",
                      },
                    },
                    additionalProperties: false,
                  },
                  LocalStorage: {
                    type: "string",
                  },
                  LocalStorageTypes: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  TotalLocalStorageGB: {
                    type: "object",
                    properties: {
                      Min: {
                        type: "number",
                      },
                      Max: {
                        type: "number",
                      },
                    },
                    additionalProperties: false,
                  },
                  BaselineEbsBandwidthMbps: {
                    type: "object",
                    properties: {
                      Min: {
                        type: "number",
                      },
                      Max: {
                        type: "number",
                      },
                    },
                    additionalProperties: false,
                  },
                  AcceleratorTypes: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  AcceleratorCount: {
                    type: "object",
                    properties: {
                      Min: {
                        type: "number",
                      },
                      Max: {
                        type: "number",
                      },
                    },
                    additionalProperties: false,
                  },
                  AcceleratorManufacturers: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  AcceleratorNames: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  AcceleratorTotalMemoryMiB: {
                    type: "object",
                    properties: {
                      Min: {
                        type: "number",
                      },
                      Max: {
                        type: "number",
                      },
                    },
                    additionalProperties: false,
                  },
                  NetworkBandwidthGbps: {
                    type: "object",
                    properties: {
                      Min: {
                        type: "number",
                      },
                      Max: {
                        type: "number",
                      },
                    },
                    additionalProperties: false,
                  },
                  AllowedInstanceTypes: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  MaxSpotPriceAsPercentageOfOptimalOnDemandPrice: {
                    type: "number",
                  },
                  BaselinePerformanceFactors: {
                    type: "object",
                    properties: {
                      Cpu: {
                        type: "object",
                        properties: {
                          References: {
                            type: "object",
                            additionalProperties: true,
                          },
                        },
                        additionalProperties: false,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                required: ["VCpuCount", "MemoryMiB"],
                additionalProperties: false,
              },
              PrivateDnsNameOptions: {
                type: "object",
                properties: {
                  HostnameType: {
                    type: "string",
                  },
                  EnableResourceNameDnsARecord: {
                    type: "boolean",
                  },
                  EnableResourceNameDnsAAAARecord: {
                    type: "boolean",
                  },
                },
                additionalProperties: false,
              },
              MaintenanceOptions: {
                type: "object",
                properties: {
                  AutoRecovery: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              DisableApiStop: {
                type: "boolean",
              },
              Operator: {
                type: "object",
                properties: {
                  Principal: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              NetworkPerformanceOptions: {
                type: "object",
                properties: {
                  BandwidthWeighting: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
            },
            additionalProperties: false,
          },
          required: true,
        },
        Operator: {
          name: "Operator",
          description: "Reserved for internal use.",
          type: {
            type: "object",
            properties: {
              Principal: {
                type: "string",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        TagSpecifications: {
          name: "Tag Specifications",
          description: "The tags to apply to the launch template on creation.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ResourceType: {
                  type: "string",
                },
                Tags: {
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
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new EC2Client({
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

        const command = new CreateLaunchTemplateCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Launch Template Result",
      description: "Result from CreateLaunchTemplate operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          LaunchTemplate: {
            type: "object",
            properties: {
              LaunchTemplateId: {
                type: "string",
              },
              LaunchTemplateName: {
                type: "string",
              },
              CreateTime: {
                type: "string",
              },
              CreatedBy: {
                type: "string",
              },
              DefaultVersionNumber: {
                type: "number",
              },
              LatestVersionNumber: {
                type: "number",
              },
              Tags: {
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
              Operator: {
                type: "object",
                properties: {
                  Managed: {
                    type: "boolean",
                  },
                  Principal: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
            },
            additionalProperties: false,
            description: "Information about the launch template.",
          },
          Warning: {
            type: "object",
            properties: {
              Errors: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Code: {
                      type: "string",
                    },
                    Message: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
            },
            additionalProperties: false,
            description:
              "If the launch template contains parameters or parameter combinations that are not valid, an error code and an error message are returned for each issue that's found.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createLaunchTemplate;
