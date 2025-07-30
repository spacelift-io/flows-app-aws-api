import { AppBlock, events } from "@slflows/sdk/v1";
import { WAFClient, GetLoggingConfigurationCommand } from "@aws-sdk/client-waf";

const getLoggingConfiguration: AppBlock = {
  name: "Get Logging Configuration",
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
        ResourceArn: {
          name: "Resource Arn",
          description:
            "The Amazon Resource Name (ARN) of the web ACL for which you want to get the LoggingConfiguration.",
          type: "string",
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
        });

        const command = new GetLoggingConfigurationCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Logging Configuration Result",
      description: "Result from GetLoggingConfiguration operation",
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
            description: "The LoggingConfiguration for the specified web ACL.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getLoggingConfiguration;
