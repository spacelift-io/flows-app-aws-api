import { AppBlock, events } from "@slflows/sdk/v1";
import {
  WAFClient,
  ListLoggingConfigurationsCommand,
} from "@aws-sdk/client-waf";

const listLoggingConfigurations: AppBlock = {
  name: "List Logging Configurations",
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
        NextMarker: {
          name: "Next Marker",
          description:
            "If you specify a value for Limit and you have more LoggingConfigurations than the value of Limit, AWS WAF returns a NextMarker value in the response that allows you to list another group of LoggingConfigurations.",
          type: "string",
          required: false,
        },
        Limit: {
          name: "Limit",
          description:
            "Specifies the number of LoggingConfigurations that you want AWS WAF to return for this request.",
          type: "number",
          required: false,
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

        const command = new ListLoggingConfigurationsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Logging Configurations Result",
      description: "Result from ListLoggingConfigurations operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          LoggingConfigurations: {
            type: "array",
            items: {
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
                        type: "object",
                        additionalProperties: true,
                      },
                      Data: {
                        type: "object",
                        additionalProperties: true,
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
            description: "An array of LoggingConfiguration objects.",
          },
          NextMarker: {
            type: "string",
            description:
              "If you have more LoggingConfigurations than the number that you specified for Limit in the request, the response includes a NextMarker value.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listLoggingConfigurations;
