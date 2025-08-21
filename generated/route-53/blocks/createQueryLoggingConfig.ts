import { AppBlock, events } from "@slflows/sdk/v1";
import {
  Route53Client,
  CreateQueryLoggingConfigCommand,
} from "@aws-sdk/client-route-53";

const createQueryLoggingConfig: AppBlock = {
  name: "Create Query Logging Config",
  description: "Creates a configuration for DNS query logging.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        HostedZoneId: {
          name: "Hosted Zone Id",
          description:
            "The ID of the hosted zone that you want to log queries for.",
          type: "string",
          required: true,
        },
        CloudWatchLogsLogGroupArn: {
          name: "Cloud Watch Logs Log Group Arn",
          description:
            "The Amazon Resource Name (ARN) for the log group that you want to Amazon Route 53 to send query logs to.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new Route53Client({
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

        const command = new CreateQueryLoggingConfigCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Query Logging Config Result",
      description: "Result from CreateQueryLoggingConfig operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          QueryLoggingConfig: {
            type: "object",
            properties: {
              Id: {
                type: "string",
              },
              HostedZoneId: {
                type: "string",
              },
              CloudWatchLogsLogGroupArn: {
                type: "string",
              },
            },
            required: ["Id", "HostedZoneId", "CloudWatchLogsLogGroupArn"],
            additionalProperties: false,
            description:
              "A complex type that contains the ID for a query logging configuration, the ID of the hosted zone that you want to log queries for, and the ARN for the log group that you want Amazon Route 53 to send query logs to.",
          },
          Location: {
            type: "string",
            description:
              "The unique URL representing the new query logging configuration.",
          },
        },
        required: ["QueryLoggingConfig", "Location"],
      },
    },
  },
};

export default createQueryLoggingConfig;
