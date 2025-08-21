import { AppBlock, events } from "@slflows/sdk/v1";
import { WAFClient, CreateRegexPatternSetCommand } from "@aws-sdk/client-waf";

const createRegexPatternSet: AppBlock = {
  name: "Create Regex Pattern Set",
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
          description: "A friendly name or description of the RegexPatternSet.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new CreateRegexPatternSetCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Regex Pattern Set Result",
      description: "Result from CreateRegexPatternSet operation",
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
            description: "A RegexPatternSet that contains no objects.",
          },
          ChangeToken: {
            type: "string",
            description:
              "The ChangeToken that you used to submit the CreateRegexPatternSet request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createRegexPatternSet;
