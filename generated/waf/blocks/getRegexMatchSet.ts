import { AppBlock, events } from "@slflows/sdk/v1";
import { WAFClient, GetRegexMatchSetCommand } from "@aws-sdk/client-waf";

const getRegexMatchSet: AppBlock = {
  name: "Get Regex Match Set",
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
        RegexMatchSetId: {
          name: "Regex Match Set Id",
          description:
            "The RegexMatchSetId of the RegexMatchSet that you want to get.",
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

        const command = new GetRegexMatchSetCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Regex Match Set Result",
      description: "Result from GetRegexMatchSet operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          RegexMatchSet: {
            type: "object",
            properties: {
              RegexMatchSetId: {
                type: "string",
              },
              Name: {
                type: "string",
              },
              RegexMatchTuples: {
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
                    RegexPatternSetId: {
                      type: "string",
                    },
                  },
                  required: [
                    "FieldToMatch",
                    "TextTransformation",
                    "RegexPatternSetId",
                  ],
                  additionalProperties: false,
                },
              },
            },
            additionalProperties: false,
            description:
              "Information about the RegexMatchSet that you specified in the GetRegexMatchSet request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getRegexMatchSet;
