import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeSpotInstanceRequestsCommand,
} from "@aws-sdk/client-ec2";

const describeSpotInstanceRequests: AppBlock = {
  name: "Describe Spot Instance Requests",
  description: "Describes the specified Spot Instance requests.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
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
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the action, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
        },
        SpotInstanceRequestIds: {
          name: "Spot Instance Request Ids",
          description: "The IDs of the Spot Instance requests.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
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
        });

        const command = new DescribeSpotInstanceRequestsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Spot Instance Requests Result",
      description: "Result from DescribeSpotInstanceRequests operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          SpotInstanceRequests: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ActualBlockHourlyPrice: {
                  type: "string",
                },
                AvailabilityZoneGroup: {
                  type: "string",
                },
                BlockDurationMinutes: {
                  type: "number",
                },
                CreateTime: {
                  type: "string",
                },
                Fault: {
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
                InstanceId: {
                  type: "string",
                },
                LaunchGroup: {
                  type: "string",
                },
                LaunchSpecification: {
                  type: "object",
                  properties: {
                    UserData: {
                      type: "string",
                    },
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
                    SubnetId: {
                      type: "string",
                    },
                    SecurityGroups: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    Monitoring: {
                      type: "object",
                      properties: {
                        Enabled: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["Enabled"],
                      additionalProperties: false,
                    },
                  },
                  additionalProperties: false,
                },
                LaunchedAvailabilityZone: {
                  type: "string",
                },
                ProductDescription: {
                  type: "string",
                },
                SpotInstanceRequestId: {
                  type: "string",
                },
                SpotPrice: {
                  type: "string",
                },
                State: {
                  type: "string",
                },
                Status: {
                  type: "object",
                  properties: {
                    Code: {
                      type: "string",
                    },
                    Message: {
                      type: "string",
                    },
                    UpdateTime: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
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
                Type: {
                  type: "string",
                },
                ValidFrom: {
                  type: "string",
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
            description: "The Spot Instance requests.",
          },
          NextToken: {
            type: "string",
            description:
              "The token to include in another request to get the next page of items.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeSpotInstanceRequests;
