import { AppBlock, events } from "@slflows/sdk/v1";
import {
  Route53Client,
  GetQueryLoggingConfigCommand,
} from "@aws-sdk/client-route-53";

const getQueryLoggingConfig: AppBlock = {
  name: "Get Query Logging Config",
  description:
    "Gets information about a specified configuration for DNS query logging.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Id: {
          name: "Id",
          description:
            "The ID of the configuration for DNS query logging that you want to get information about.",
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
        });

        const command = new GetQueryLoggingConfigCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Query Logging Config Result",
      description: "Result from GetQueryLoggingConfig operation",
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
              "A complex type that contains information about the query logging configuration that you specified in a GetQueryLoggingConfig request.",
          },
        },
        required: ["QueryLoggingConfig"],
      },
    },
  },
};

export default getQueryLoggingConfig;
