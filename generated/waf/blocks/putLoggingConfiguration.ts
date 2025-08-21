import { AppBlock, events } from "@slflows/sdk/v1";
import { WAFClient, PutLoggingConfigurationCommand } from "@aws-sdk/client-waf";

const putLoggingConfiguration: AppBlock = {
  name: "Put Logging Configuration",
  description: "This is AWS WAF Classic documentation.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        LoggingConfiguration: {
          name: "Logging Configuration",
          description:
            "The Amazon Kinesis Data Firehose that contains the inspected traffic information, the redacted fields details, and the Amazon Resource Name (ARN) of the web ACL to monitor.",
          type: {
            type: "object",
            properties: {
              ResourceArn: {
                type: "string",
              },
              LogDestinationConfigs: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              RedactedFields: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Type: {
                      type: "string",
                    },
                    Data: {
                      type: "string",
                    },
                  },
                  required: ["Type"],
                  additionalProperties: false,
                },
              },
            },
            required: ["ResourceArn", "LogDestinationConfigs"],
            additionalProperties: false,
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new WAFClient({
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

        const command = new PutLoggingConfigurationCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Logging Configuration Result",
      description: "Result from PutLoggingConfiguration operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          LoggingConfiguration: {
            type: "object",
            properties: {
              ResourceArn: {
                type: "string",
              },
              LogDestinationConfigs: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              RedactedFields: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Type: {
                      type: "string",
                    },
                    Data: {
                      type: "string",
                    },
                  },
                  required: ["Type"],
                  additionalProperties: false,
                },
              },
            },
            required: ["ResourceArn", "LogDestinationConfigs"],
            additionalProperties: false,
            description:
              "The LoggingConfiguration that you submitted in the request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default putLoggingConfiguration;
