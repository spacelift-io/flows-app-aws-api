import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DisableAwsNetworkPerformanceMetricSubscriptionCommand,
} from "@aws-sdk/client-ec2";

const disableAwsNetworkPerformanceMetricSubscription: AppBlock = {
  name: "Disable Aws Network Performance Metric Subscription",
  description: "Disables Infrastructure Performance metric subscriptions.",
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
            "The source Region or Availability Zone that the metric subscription is disabled for.",
          type: "string",
          required: false,
        },
        Destination: {
          name: "Destination",
          description:
            "The target Region or Availability Zone that the metric subscription is disabled for.",
          type: "string",
          required: false,
        },
        Metric: {
          name: "Metric",
          description: "The metric used for the disabled subscription.",
          type: "string",
          required: false,
        },
        Statistic: {
          name: "Statistic",
          description: "The statistic used for the disabled subscription.",
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
          new DisableAwsNetworkPerformanceMetricSubscriptionCommand(
            commandInput as any,
          );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Disable Aws Network Performance Metric Subscription Result",
      description:
        "Result from DisableAwsNetworkPerformanceMetricSubscription operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Output: {
            type: "boolean",
            description:
              "Indicates whether the unsubscribe action was successful.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default disableAwsNetworkPerformanceMetricSubscription;
