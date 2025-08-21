import { AppBlock, events } from "@slflows/sdk/v1";
import { WAFClient, UpdateRegexPatternSetCommand } from "@aws-sdk/client-waf";

const updateRegexPatternSet: AppBlock = {
  name: "Update Regex Pattern Set",
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
            "The RegexPatternSetId of the RegexPatternSet that you want to update.",
          type: "string",
          required: true,
        },
        Updates: {
          name: "Updates",
          description:
            "An array of RegexPatternSetUpdate objects that you want to insert into or delete from a RegexPatternSet.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Action: {
                  type: "string",
                },
                RegexPatternString: {
                  type: "string",
                },
              },
              required: ["Action", "RegexPatternString"],
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

        const command = new UpdateRegexPatternSetCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Regex Pattern Set Result",
      description: "Result from UpdateRegexPatternSet operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ChangeToken: {
            type: "string",
            description:
              "The ChangeToken that you used to submit the UpdateRegexPatternSet request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateRegexPatternSet;
