import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  GetAwsNetworkPerformanceDataCommand,
} from "@aws-sdk/client-ec2";

const getAwsNetworkPerformanceData: AppBlock = {
  name: "Get Aws Network Performance Data",
  description: "Gets network performance data.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DataQueries: {
          name: "Data Queries",
          description: "A list of network performance data queries.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Id: {
                  type: "string",
                },
                Source: {
                  type: "string",
                },
                Destination: {
                  type: "string",
                },
                Metric: {
                  type: "string",
                },
                Statistic: {
                  type: "string",
                },
                Period: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
          },
          required: false,
        },
        StartTime: {
          name: "Start Time",
          description: "The starting time for the performance data request.",
          type: "string",
          required: false,
        },
        EndTime: {
          name: "End Time",
          description: "The ending time for the performance data request.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of results to return with a single call.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token for the next page of results.",
          type: "string",
          required: false,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the action, without actually making the request, and provides an error response.",
          type: "boolean",
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

        const command = new GetAwsNetworkPerformanceDataCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Aws Network Performance Data Result",
      description: "Result from GetAwsNetworkPerformanceData operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DataResponses: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Id: {
                  type: "string",
                },
                Source: {
                  type: "string",
                },
                Destination: {
                  type: "string",
                },
                Metric: {
                  type: "string",
                },
                Statistic: {
                  type: "string",
                },
                Period: {
                  type: "string",
                },
                MetricPoints: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      StartDate: {
                        type: "object",
                        additionalProperties: true,
                      },
                      EndDate: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Value: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Status: {
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
            description: "The list of data responses.",
          },
          NextToken: {
            type: "string",
            description:
              "The token to use to retrieve the next page of results.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getAwsNetworkPerformanceData;
