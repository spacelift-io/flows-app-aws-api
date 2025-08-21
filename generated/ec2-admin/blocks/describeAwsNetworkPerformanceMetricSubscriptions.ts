import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeAwsNetworkPerformanceMetricSubscriptionsCommand,
} from "@aws-sdk/client-ec2";

const describeAwsNetworkPerformanceMetricSubscriptions: AppBlock = {
  name: "Describe Aws Network Performance Metric Subscriptions",
  description:
    "Describes the current Infrastructure Performance metric subscriptions.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
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
        Filters: {
          name: "Filters",
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

        const command =
          new DescribeAwsNetworkPerformanceMetricSubscriptionsCommand(
            commandInput as any,
          );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Aws Network Performance Metric Subscriptions Result",
      description:
        "Result from DescribeAwsNetworkPerformanceMetricSubscriptions operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NextToken: {
            type: "string",
            description:
              "The token to use to retrieve the next page of results.",
          },
          Subscriptions: {
            type: "array",
            items: {
              type: "object",
              properties: {
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
            description:
              "Describes the current Infrastructure Performance subscriptions.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeAwsNetworkPerformanceMetricSubscriptions;
