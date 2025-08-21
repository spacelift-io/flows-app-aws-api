import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, DescribeFlowLogsCommand } from "@aws-sdk/client-ec2";

const describeFlowLogs: AppBlock = {
  name: "Describe Flow Logs",
  description: "Describes one or more flow logs.",
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
        Filter: {
          name: "Filter",
          description: "One or more filters.",
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
        FlowLogIds: {
          name: "Flow Log Ids",
          description: "One or more flow log IDs.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of items to return for this request.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token to request the next page of items.",
          type: "string",
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

        const command = new DescribeFlowLogsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Flow Logs Result",
      description: "Result from DescribeFlowLogs operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          FlowLogs: {
            type: "array",
            items: {
              type: "object",
              properties: {
                CreationTime: {
                  type: "string",
                },
                DeliverLogsErrorMessage: {
                  type: "string",
                },
                DeliverLogsPermissionArn: {
                  type: "string",
                },
                DeliverCrossAccountRole: {
                  type: "string",
                },
                DeliverLogsStatus: {
                  type: "string",
                },
                FlowLogId: {
                  type: "string",
                },
                FlowLogStatus: {
                  type: "string",
                },
                LogGroupName: {
                  type: "string",
                },
                ResourceId: {
                  type: "string",
                },
                TrafficType: {
                  type: "string",
                },
                LogDestinationType: {
                  type: "string",
                },
                LogDestination: {
                  type: "string",
                },
                LogFormat: {
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
                MaxAggregationInterval: {
                  type: "number",
                },
                DestinationOptions: {
                  type: "object",
                  properties: {
                    FileFormat: {
                      type: "string",
                    },
                    HiveCompatiblePartitions: {
                      type: "boolean",
                    },
                    PerHourPartition: {
                      type: "boolean",
                    },
                  },
                  additionalProperties: false,
                },
              },
              additionalProperties: false,
            },
            description: "Information about the flow logs.",
          },
          NextToken: {
            type: "string",
            description: "The token to request the next page of items.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeFlowLogs;
