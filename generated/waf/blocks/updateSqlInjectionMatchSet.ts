import { AppBlock, events } from "@slflows/sdk/v1";
import {
  WAFClient,
  UpdateSqlInjectionMatchSetCommand,
} from "@aws-sdk/client-waf";

const updateSqlInjectionMatchSet: AppBlock = {
  name: "Update Sql Injection Match Set",
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
            "The SqlInjectionMatchSetId of the SqlInjectionMatchSet that you want to update.",
          type: "string",
          required: true,
        },
        ChangeToken: {
          name: "Change Token",
          description:
            "The value returned by the most recent call to GetChangeToken.",
          type: "string",
          required: true,
        },
        Updates: {
          name: "Updates",
          description:
            "An array of SqlInjectionMatchSetUpdate objects that you want to insert into or delete from a SqlInjectionMatchSet.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Action: {
                  type: "string",
                },
                SqlInjectionMatchTuple: {
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
              required: ["Action", "SqlInjectionMatchTuple"],
              additionalProperties: false,
            },
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

        const command = new UpdateSqlInjectionMatchSetCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Sql Injection Match Set Result",
      description: "Result from UpdateSqlInjectionMatchSet operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ChangeToken: {
            type: "string",
            description:
              "The ChangeToken that you used to submit the UpdateSqlInjectionMatchSet request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateSqlInjectionMatchSet;
