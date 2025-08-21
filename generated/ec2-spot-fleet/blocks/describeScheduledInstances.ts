import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeScheduledInstancesCommand,
} from "@aws-sdk/client-ec2";

const describeScheduledInstances: AppBlock = {
  name: "Describe Scheduled Instances",
  description:
    "Describes the specified Scheduled Instances or all your Scheduled Instances.",
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
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of results to return in a single call.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token for the next set of results.",
          type: "string",
          required: false,
        },
        ScheduledInstanceIds: {
          name: "Scheduled Instance Ids",
          description: "The Scheduled Instance IDs.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        SlotStartTimeRange: {
          name: "Slot Start Time Range",
          description: "The time period for the first schedule to start.",
          type: {
            type: "object",
            properties: {
              EarliestTime: {
                type: "string",
              },
              LatestTime: {
                type: "string",
              },
            },
            additionalProperties: false,
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

        const command = new DescribeScheduledInstancesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Scheduled Instances Result",
      description: "Result from DescribeScheduledInstances operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NextToken: {
            type: "string",
            description:
              "The token required to retrieve the next set of results.",
          },
          ScheduledInstanceSet: {
            type: "array",
            items: {
              type: "object",
              properties: {
                AvailabilityZone: {
                  type: "string",
                },
                CreateDate: {
                  type: "string",
                },
                HourlyPrice: {
                  type: "string",
                },
                InstanceCount: {
                  type: "number",
                },
                InstanceType: {
                  type: "string",
                },
                NetworkPlatform: {
                  type: "string",
                },
                NextSlotStartTime: {
                  type: "string",
                },
                Platform: {
                  type: "string",
                },
                PreviousSlotEndTime: {
                  type: "string",
                },
                Recurrence: {
                  type: "object",
                  properties: {
                    Frequency: {
                      type: "string",
                    },
                    Interval: {
                      type: "number",
                    },
                    OccurrenceDaySet: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    OccurrenceRelativeToEnd: {
                      type: "boolean",
                    },
                    OccurrenceUnit: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                ScheduledInstanceId: {
                  type: "string",
                },
                SlotDurationInHours: {
                  type: "number",
                },
                TermEndDate: {
                  type: "string",
                },
                TermStartDate: {
                  type: "string",
                },
                TotalScheduledInstanceHours: {
                  type: "number",
                },
              },
              additionalProperties: false,
            },
            description: "Information about the Scheduled Instances.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeScheduledInstances;
