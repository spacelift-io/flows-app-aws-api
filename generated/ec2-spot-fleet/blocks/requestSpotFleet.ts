import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, RequestSpotFleetCommand } from "@aws-sdk/client-ec2";

const requestSpotFleet: AppBlock = {
  name: "Request Spot Fleet",
  description: "Creates a Spot Fleet request.",
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
        SpotFleetRequestConfig: {
          name: "Spot Fleet Request Config",
          description: "The configuration for the Spot Fleet request.",
          type: {
            type: "object",
            properties: {
              AllocationStrategy: {
                type: "string",
              },
              OnDemandAllocationStrategy: {
                type: "string",
              },
              SpotMaintenanceStrategies: {
                type: "object",
                properties: {
                  CapacityRebalance: {
                    type: "object",
                    properties: {
                      ReplacementStrategy: {
                        type: "string",
                      },
                      TerminationDelay: {
                        type: "number",
                      },
                    },
                    additionalProperties: false,
                  },
                },
                additionalProperties: false,
              },
              ClientToken: {
                type: "string",
              },
              ExcessCapacityTerminationPolicy: {
                type: "string",
              },
              FulfilledCapacity: {
                type: "number",
              },
              OnDemandFulfilledCapacity: {
                type: "number",
              },
              IamFleetRole: {
                type: "string",
              },
              LaunchSpecifications: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    AddressingType: {
                      type: "string",
                    },
                    BlockDeviceMappings: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    EbsOptimized: {
                      type: "boolean",
                    },
                    IamInstanceProfile: {
                      type: "object",
                      properties: {
                        Arn: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Name: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                    ImageId: {
                      type: "string",
                    },
                    InstanceType: {
                      type: "string",
                    },
                    KernelId: {
                      type: "string",
                    },
                    KeyName: {
                      type: "string",
                    },
                    Monitoring: {
                      type: "object",
                      properties: {
                        Enabled: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                    NetworkInterfaces: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    Placement: {
                      type: "object",
                      properties: {
                        AvailabilityZone: {
                          type: "object",
                          additionalProperties: true,
                        },
                        GroupName: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Tenancy: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                    RamdiskId: {
                      type: "string",
                    },
                    SpotPrice: {
                      type: "string",
                    },
                    SubnetId: {
                      type: "string",
                    },
                    UserData: {
                      type: "string",
                    },
                    WeightedCapacity: {
                      type: "number",
                    },
                    TagSpecifications: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    InstanceRequirements: {
                      type: "object",
                      properties: {
                        VCpuCount: {
                          type: "object",
                          additionalProperties: true,
                        },
                        MemoryMiB: {
                          type: "object",
                          additionalProperties: true,
                        },
                        CpuManufacturers: {
                          type: "object",
                          additionalProperties: true,
                        },
                        MemoryGiBPerVCpu: {
                          type: "object",
                          additionalProperties: true,
                        },
                        ExcludedInstanceTypes: {
                          type: "object",
                          additionalProperties: true,
                        },
                        InstanceGenerations: {
                          type: "object",
                          additionalProperties: true,
                        },
                        SpotMaxPricePercentageOverLowestPrice: {
                          type: "object",
                          additionalProperties: true,
                        },
                        OnDemandMaxPricePercentageOverLowestPrice: {
                          type: "object",
                          additionalProperties: true,
                        },
                        BareMetal: {
                          type: "object",
                          additionalProperties: true,
                        },
                        BurstablePerformance: {
                          type: "object",
                          additionalProperties: true,
                        },
                        RequireHibernateSupport: {
                          type: "object",
                          additionalProperties: true,
                        },
                        NetworkInterfaceCount: {
                          type: "object",
                          additionalProperties: true,
                        },
                        LocalStorage: {
                          type: "object",
                          additionalProperties: true,
                        },
                        LocalStorageTypes: {
                          type: "object",
                          additionalProperties: true,
                        },
                        TotalLocalStorageGB: {
                          type: "object",
                          additionalProperties: true,
                        },
                        BaselineEbsBandwidthMbps: {
                          type: "object",
                          additionalProperties: true,
                        },
                        AcceleratorTypes: {
                          type: "object",
                          additionalProperties: true,
                        },
                        AcceleratorCount: {
                          type: "object",
                          additionalProperties: true,
                        },
                        AcceleratorManufacturers: {
                          type: "object",
                          additionalProperties: true,
                        },
                        AcceleratorNames: {
                          type: "object",
                          additionalProperties: true,
                        },
                        AcceleratorTotalMemoryMiB: {
                          type: "object",
                          additionalProperties: true,
                        },
                        NetworkBandwidthGbps: {
                          type: "object",
                          additionalProperties: true,
                        },
                        AllowedInstanceTypes: {
                          type: "object",
                          additionalProperties: true,
                        },
                        MaxSpotPriceAsPercentageOfOptimalOnDemandPrice: {
                          type: "object",
                          additionalProperties: true,
                        },
                        BaselinePerformanceFactors: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                    SecurityGroups: {
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
              LaunchTemplateConfigs: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    LaunchTemplateSpecification: {
                      type: "object",
                      properties: {
                        LaunchTemplateId: {
                          type: "object",
                          additionalProperties: true,
                        },
                        LaunchTemplateName: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Version: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                    Overrides: {
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
              SpotPrice: {
                type: "string",
              },
              TargetCapacity: {
                type: "number",
              },
              OnDemandTargetCapacity: {
                type: "number",
              },
              OnDemandMaxTotalPrice: {
                type: "string",
              },
              SpotMaxTotalPrice: {
                type: "string",
              },
              TerminateInstancesWithExpiration: {
                type: "boolean",
              },
              Type: {
                type: "string",
              },
              ValidFrom: {
                type: "string",
              },
              ValidUntil: {
                type: "string",
              },
              ReplaceUnhealthyInstances: {
                type: "boolean",
              },
              InstanceInterruptionBehavior: {
                type: "string",
              },
              LoadBalancersConfig: {
                type: "object",
                properties: {
                  ClassicLoadBalancersConfig: {
                    type: "object",
                    properties: {
                      ClassicLoadBalancers: {
                        type: "array",
                        items: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                    },
                    additionalProperties: false,
                  },
                  TargetGroupsConfig: {
                    type: "object",
                    properties: {
                      TargetGroups: {
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
                additionalProperties: false,
              },
              InstancePoolsToUseCount: {
                type: "number",
              },
              Context: {
                type: "string",
              },
              TargetCapacityUnitType: {
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
            },
            required: ["IamFleetRole", "TargetCapacity"],
            additionalProperties: false,
          },
          required: true,
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

        const command = new RequestSpotFleetCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Request Spot Fleet Result",
      description: "Result from RequestSpotFleet operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          SpotFleetRequestId: {
            type: "string",
            description: "The ID of the Spot Fleet request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default requestSpotFleet;
