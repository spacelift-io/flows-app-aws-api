import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  CreateMonitoringSubscriptionCommand,
} from "@aws-sdk/client-cloudfront";

const createMonitoringSubscription: AppBlock = {
  name: "Create Monitoring Subscription",
  description:
    "Enables or disables additional Amazon CloudWatch metrics for the specified CloudFront distribution.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DistributionId: {
          name: "Distribution Id",
          description:
            "The ID of the distribution that you are enabling metrics for.",
          type: "string",
          required: true,
        },
        MonitoringSubscription: {
          name: "Monitoring Subscription",
          description: "A monitoring subscription.",
          type: {
            type: "object",
            properties: {
              RealtimeMetricsSubscriptionConfig: {
                type: "object",
                properties: {
                  RealtimeMetricsSubscriptionStatus: {
                    type: "string",
                  },
                },
                required: ["RealtimeMetricsSubscriptionStatus"],
                additionalProperties: false,
              },
            },
            additionalProperties: false,
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudFrontClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new CreateMonitoringSubscriptionCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Monitoring Subscription Result",
      description: "Result from CreateMonitoringSubscription operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          MonitoringSubscription: {
            type: "object",
            properties: {
              RealtimeMetricsSubscriptionConfig: {
                type: "object",
                properties: {
                  RealtimeMetricsSubscriptionStatus: {
                    type: "string",
                  },
                },
                required: ["RealtimeMetricsSubscriptionStatus"],
                additionalProperties: false,
              },
            },
            additionalProperties: false,
            description: "A monitoring subscription.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createMonitoringSubscription;
