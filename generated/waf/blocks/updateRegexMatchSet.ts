import { AppBlock, events } from "@slflows/sdk/v1";
import { WAFClient, UpdateRegexMatchSetCommand } from "@aws-sdk/client-waf";

const updateRegexMatchSet: AppBlock = {
  name: "Update Regex Match Set",
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
            "The RegexMatchSetId of the RegexMatchSet that you want to update.",
          type: "string",
          required: true,
        },
        Updates: {
          name: "Updates",
          description:
            "An array of RegexMatchSetUpdate objects that you want to insert into or delete from a RegexMatchSet.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Action: {
                  type: "string",
                },
                RegexMatchTuple: {
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
              required: ["Action", "RegexMatchTuple"],
              additionalProperties: false,
            },
          },
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new UpdateRegexMatchSetCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Regex Match Set Result",
      description: "Result from UpdateRegexMatchSet operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ChangeToken: {
            type: "string",
            description:
              "The ChangeToken that you used to submit the UpdateRegexMatchSet request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateRegexMatchSet;
