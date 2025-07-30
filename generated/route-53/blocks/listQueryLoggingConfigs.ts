import { AppBlock, events } from "@slflows/sdk/v1";
import {
  Route53Client,
  ListQueryLoggingConfigsCommand,
} from "@aws-sdk/client-route-53";

const listQueryLoggingConfigs: AppBlock = {
  name: "List Query Logging Configs",
  description:
    "Lists the configurations for DNS query logging that are associated with the current Amazon Web Services account or the configuration that is associated with a specified hosted zone.",
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
            "(Optional) If you want to list the query logging configuration that is associated with a hosted zone, specify the ID in HostedZoneId.",
          type: "string",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description:
            "(Optional) If the current Amazon Web Services account has more than MaxResults query logging configurations, use NextToken to get the second and subsequent pages of results.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "(Optional) The maximum number of query logging configurations that you want Amazon Route 53 to return in response to the current request.",
          type: "string",
          required: false,
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
        });

        const command = new ListQueryLoggingConfigsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Query Logging Configs Result",
      description: "Result from ListQueryLoggingConfigs operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          QueryLoggingConfigs: {
            type: "array",
            items: {
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
            },
            description:
              "An array that contains one QueryLoggingConfig element for each configuration for DNS query logging that is associated with the current Amazon Web Services account.",
          },
          NextToken: {
            type: "string",
            description:
              "If a response includes the last of the query logging configurations that are associated with the current Amazon Web Services account, NextToken doesn't appear in the response.",
          },
        },
        required: ["QueryLoggingConfigs"],
      },
    },
  },
};

export default listQueryLoggingConfigs;
