import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeSpotFleetRequestsCommand,
} from "@aws-sdk/client-ec2";

const describeSpotFleetRequests: AppBlock = {
  name: "Describe Spot Fleet Requests",
  description: "Describes your Spot Fleet requests.",
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
        SpotFleetRequestIds: {
          name: "Spot Fleet Request Ids",
          description: "The IDs of the Spot Fleet requests.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description:
            "The token to include in another request to get the next page of items.",
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
        });

        const command = new DescribeSpotFleetRequestsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Spot Fleet Requests Result",
      description: "Result from DescribeSpotFleetRequests operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NextToken: {
            type: "string",
            description:
              "The token to include in another request to get the next page of items.",
          },
          SpotFleetRequestConfigs: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ActivityStatus: {
                  type: "string",
                },
                CreateTime: {
                  type: "string",
                },
                SpotFleetRequestConfig: {
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
                          additionalProperties: true,
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
                        additionalProperties: true,
                      },
                    },
                    LaunchTemplateConfigs: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
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
                          additionalProperties: true,
                        },
                        TargetGroupsConfig: {
                          type: "object",
                          additionalProperties: true,
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
                        additionalProperties: true,
                      },
                    },
                  },
                  required: ["IamFleetRole", "TargetCapacity"],
                  additionalProperties: false,
                },
                SpotFleetRequestId: {
                  type: "string",
                },
                SpotFleetRequestState: {
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
            description:
              "Information about the configuration of your Spot Fleet.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeSpotFleetRequests;
