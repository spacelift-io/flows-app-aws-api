import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  EnableAwsNetworkPerformanceMetricSubscriptionCommand,
} from "@aws-sdk/client-ec2";

const enableAwsNetworkPerformanceMetricSubscription: AppBlock = {
  name: "Enable Aws Network Performance Metric Subscription",
  description: "Enables Infrastructure Performance subscriptions.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Source: {
          name: "Source",
          description:
            "The source Region (like us-east-1) or Availability Zone ID (like use1-az1) that the metric subscription is enabled for.",
          type: "string",
          required: false,
        },
        Destination: {
          name: "Destination",
          description:
            "The target Region (like us-east-2) or Availability Zone ID (like use2-az2) that the metric subscription is enabled for.",
          type: "string",
          required: false,
        },
        Metric: {
          name: "Metric",
          description: "The metric used for the enabled subscription.",
          type: "string",
          required: false,
        },
        Statistic: {
          name: "Statistic",
          description: "The statistic used for the enabled subscription.",
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

        const command =
          new EnableAwsNetworkPerformanceMetricSubscriptionCommand(
            commandInput as any,
          );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Enable Aws Network Performance Metric Subscription Result",
      description:
        "Result from EnableAwsNetworkPerformanceMetricSubscription operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Output: {
            type: "boolean",
            description:
              "Indicates whether the subscribe action was successful.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default enableAwsNetworkPerformanceMetricSubscription;
