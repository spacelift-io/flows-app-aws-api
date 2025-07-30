import { AppBlock, events } from "@slflows/sdk/v1";
import { WAFClient, CreateRegexMatchSetCommand } from "@aws-sdk/client-waf";

const createRegexMatchSet: AppBlock = {
  name: "Create Regex Match Set",
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
          description: "A friendly name or description of the RegexMatchSet.",
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

        const command = new CreateRegexMatchSetCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Regex Match Set Result",
      description: "Result from CreateRegexMatchSet operation",
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
              "A RegexMatchSet that contains no RegexMatchTuple objects.",
          },
          ChangeToken: {
            type: "string",
            description:
              "The ChangeToken that you used to submit the CreateRegexMatchSet request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createRegexMatchSet;
