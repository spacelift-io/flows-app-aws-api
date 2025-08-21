import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, DescribeInstancesCommand } from "@aws-sdk/client-ec2";

const describeInstances: AppBlock = {
  name: "Describe Instances",
  description: "Describes the specified instances or all instances.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        InstanceIds: {
          name: "Instance Ids",
          description: "The instance IDs.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the operation, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
        },
        Filters: {
          name: "Filters",
          description: "The filters.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: {
                  type: "string",
                },
                Values: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              additionalProperties: false,
            },
          },
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token returned from a previous paginated request.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of items to return for this request.",
          type: "number",
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

        const command = new DescribeInstancesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Instances Result",
      description: "Result from DescribeInstances operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NextToken: {
            type: "string",
            description:
              "The token to include in another request to get the next page of items.",
          },
          Reservations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ReservationId: {
                  type: "string",
                },
                OwnerId: {
                  type: "string",
                },
                RequesterId: {
                  type: "string",
                },
                Groups: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      GroupId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      GroupName: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                Instances: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Architecture: {
                        type: "object",
                        additionalProperties: true,
                      },
                      BlockDeviceMappings: {
                        type: "object",
                        additionalProperties: true,
                      },
                      ClientToken: {
                        type: "object",
                        additionalProperties: true,
                      },
                      EbsOptimized: {
                        type: "object",
                        additionalProperties: true,
                      },
                      EnaSupport: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Hypervisor: {
                        type: "object",
                        additionalProperties: true,
                      },
                      IamInstanceProfile: {
                        type: "object",
                        additionalProperties: true,
                      },
                      InstanceLifecycle: {
                        type: "object",
                        additionalProperties: true,
                      },
                      ElasticGpuAssociations: {
                        type: "object",
                        additionalProperties: true,
                      },
                      ElasticInferenceAcceleratorAssociations: {
                        type: "object",
                        additionalProperties: true,
                      },
                      NetworkInterfaces: {
                        type: "object",
                        additionalProperties: true,
                      },
                      OutpostArn: {
                        type: "object",
                        additionalProperties: true,
                      },
                      RootDeviceName: {
                        type: "object",
                        additionalProperties: true,
                      },
                      RootDeviceType: {
                        type: "object",
                        additionalProperties: true,
                      },
                      SecurityGroups: {
                        type: "object",
                        additionalProperties: true,
                      },
                      SourceDestCheck: {
                        type: "object",
                        additionalProperties: true,
                      },
                      SpotInstanceRequestId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      SriovNetSupport: {
                        type: "object",
                        additionalProperties: true,
                      },
                      StateReason: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Tags: {
                        type: "object",
                        additionalProperties: true,
                      },
                      VirtualizationType: {
                        type: "object",
                        additionalProperties: true,
                      },
                      CpuOptions: {
                        type: "object",
                        additionalProperties: true,
                      },
                      CapacityBlockId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      CapacityReservationId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      CapacityReservationSpecification: {
                        type: "object",
                        additionalProperties: true,
                      },
                      HibernationOptions: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Licenses: {
                        type: "object",
                        additionalProperties: true,
                      },
                      MetadataOptions: {
                        type: "object",
                        additionalProperties: true,
                      },
                      EnclaveOptions: {
                        type: "object",
                        additionalProperties: true,
                      },
                      BootMode: {
                        type: "object",
                        additionalProperties: true,
                      },
                      PlatformDetails: {
                        type: "object",
                        additionalProperties: true,
                      },
                      UsageOperation: {
                        type: "object",
                        additionalProperties: true,
                      },
                      UsageOperationUpdateTime: {
                        type: "object",
                        additionalProperties: true,
                      },
                      PrivateDnsNameOptions: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Ipv6Address: {
                        type: "object",
                        additionalProperties: true,
                      },
                      TpmSupport: {
                        type: "object",
                        additionalProperties: true,
                      },
                      MaintenanceOptions: {
                        type: "object",
                        additionalProperties: true,
                      },
                      CurrentInstanceBootMode: {
                        type: "object",
                        additionalProperties: true,
                      },
                      NetworkPerformanceOptions: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Operator: {
                        type: "object",
                        additionalProperties: true,
                      },
                      InstanceId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      ImageId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      State: {
                        type: "object",
                        additionalProperties: true,
                      },
                      PrivateDnsName: {
                        type: "object",
                        additionalProperties: true,
                      },
                      PublicDnsName: {
                        type: "object",
                        additionalProperties: true,
                      },
                      StateTransitionReason: {
                        type: "object",
                        additionalProperties: true,
                      },
                      KeyName: {
                        type: "object",
                        additionalProperties: true,
                      },
                      AmiLaunchIndex: {
                        type: "object",
                        additionalProperties: true,
                      },
                      ProductCodes: {
                        type: "object",
                        additionalProperties: true,
                      },
                      InstanceType: {
                        type: "object",
                        additionalProperties: true,
                      },
                      LaunchTime: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Placement: {
                        type: "object",
                        additionalProperties: true,
                      },
                      KernelId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      RamdiskId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Platform: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Monitoring: {
                        type: "object",
                        additionalProperties: true,
                      },
                      SubnetId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      VpcId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      PrivateIpAddress: {
                        type: "object",
                        additionalProperties: true,
                      },
                      PublicIpAddress: {
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
            description: "Information about the reservations.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeInstances;
