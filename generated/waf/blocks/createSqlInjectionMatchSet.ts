import { AppBlock, events } from "@slflows/sdk/v1";
import {
  WAFClient,
  CreateSqlInjectionMatchSetCommand,
} from "@aws-sdk/client-waf";

const createSqlInjectionMatchSet: AppBlock = {
  name: "Create Sql Injection Match Set",
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
        Name: {
          name: "Name",
          description:
            "A friendly name or description for the SqlInjectionMatchSet that you're creating.",
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

        const command = new CreateSqlInjectionMatchSetCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Sql Injection Match Set Result",
      description: "Result from CreateSqlInjectionMatchSet operation",
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
            description: "A SqlInjectionMatchSet.",
          },
          ChangeToken: {
            type: "string",
            description:
              "The ChangeToken that you used to submit the CreateSqlInjectionMatchSet request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createSqlInjectionMatchSet;
