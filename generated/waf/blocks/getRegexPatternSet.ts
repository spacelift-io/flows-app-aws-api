import { AppBlock, events } from "@slflows/sdk/v1";
import { WAFClient, GetRegexPatternSetCommand } from "@aws-sdk/client-waf";

const getRegexPatternSet: AppBlock = {
  name: "Get Regex Pattern Set",
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
        RegexPatternSetId: {
          name: "Regex Pattern Set Id",
          description:
            "The RegexPatternSetId of the RegexPatternSet that you want to get.",
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

        const command = new GetRegexPatternSetCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Regex Pattern Set Result",
      description: "Result from GetRegexPatternSet operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          RegexPatternSet: {
            type: "object",
            properties: {
              RegexPatternSetId: {
                type: "string",
              },
              Name: {
                type: "string",
              },
              RegexPatternStrings: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },
            required: ["RegexPatternSetId", "RegexPatternStrings"],
            additionalProperties: false,
            description:
              "Information about the RegexPatternSet that you specified in the GetRegexPatternSet request, including the identifier of the pattern set and the regular expression patterns you want AWS WAF to search for.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getRegexPatternSet;
