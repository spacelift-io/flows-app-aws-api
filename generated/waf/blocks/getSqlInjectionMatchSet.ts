import { AppBlock, events } from "@slflows/sdk/v1";
import { WAFClient, GetSqlInjectionMatchSetCommand } from "@aws-sdk/client-waf";

const getSqlInjectionMatchSet: AppBlock = {
  name: "Get Sql Injection Match Set",
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
        SqlInjectionMatchSetId: {
          name: "Sql Injection Match Set Id",
          description:
            "The SqlInjectionMatchSetId of the SqlInjectionMatchSet that you want to get.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new GetSqlInjectionMatchSetCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Sql Injection Match Set Result",
      description: "Result from GetSqlInjectionMatchSet operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          SqlInjectionMatchSet: {
            type: "object",
            properties: {
              SqlInjectionMatchSetId: {
                type: "string",
              },
              Name: {
                type: "string",
              },
              SqlInjectionMatchTuples: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    FieldToMatch: {
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
                    TextTransformation: {
                      type: "string",
                    },
                  },
                  required: ["FieldToMatch", "TextTransformation"],
                  additionalProperties: false,
                },
              },
            },
            required: ["SqlInjectionMatchSetId", "SqlInjectionMatchTuples"],
            additionalProperties: false,
            description:
              "Information about the SqlInjectionMatchSet that you specified in the GetSqlInjectionMatchSet request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getSqlInjectionMatchSet;
