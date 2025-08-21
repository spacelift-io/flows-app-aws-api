import { AppBlock, events } from "@slflows/sdk/v1";
import {
  ECSClient,
  DescribeCapacityProvidersCommand,
} from "@aws-sdk/client-ecs";

const describeCapacityProviders: AppBlock = {
  name: "Describe Capacity Providers",
  description: "Describes one or more of your capacity providers.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        capacityProviders: {
          name: "capacity Providers",
          description:
            "The short name or full Amazon Resource Name (ARN) of one or more capacity providers.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        include: {
          name: "include",
          description:
            "Specifies whether or not you want to see the resource tags for the capacity provider.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        maxResults: {
          name: "max Results",
          description:
            "The maximum number of account setting results returned by DescribeCapacityProviders in paginated output.",
          type: "number",
          required: false,
        },
        nextToken: {
          name: "next Token",
          description:
            "The nextToken value returned from a previous paginated DescribeCapacityProviders request where maxResults was used and the results exceeded the value of that parameter.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new ECSClient({
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

        const command = new DescribeCapacityProvidersCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Capacity Providers Result",
      description: "Result from DescribeCapacityProviders operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          capacityProviders: {
            type: "array",
            items: {
              type: "object",
              properties: {
                capacityProviderArn: {
                  type: "string",
                },
                name: {
                  type: "string",
                },
                status: {
                  type: "string",
                },
                autoScalingGroupProvider: {
                  type: "object",
                  properties: {
                    autoScalingGroupArn: {
                      type: "string",
                    },
                    managedScaling: {
                      type: "object",
                      properties: {
                        status: {
                          type: "object",
                          additionalProperties: true,
                        },
                        targetCapacity: {
                          type: "object",
                          additionalProperties: true,
                        },
                        minimumScalingStepSize: {
                          type: "object",
                          additionalProperties: true,
                        },
                        maximumScalingStepSize: {
                          type: "object",
                          additionalProperties: true,
                        },
                        instanceWarmupPeriod: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                    managedTerminationProtection: {
                      type: "string",
                    },
                    managedDraining: {
                      type: "string",
                    },
                  },
                  required: ["autoScalingGroupArn"],
                  additionalProperties: false,
                },
                updateStatus: {
                  type: "string",
                },
                updateStatusReason: {
                  type: "string",
                },
                tags: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      key: {
                        type: "object",
                        additionalProperties: true,
                      },
                      value: {
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
            description: "The list of capacity providers.",
          },
          failures: {
            type: "array",
            items: {
              type: "object",
              properties: {
                arn: {
                  type: "string",
                },
                reason: {
                  type: "string",
                },
                detail: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "Any failures associated with the call.",
          },
          nextToken: {
            type: "string",
            description:
              "The nextToken value to include in a future DescribeCapacityProviders request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeCapacityProviders;
