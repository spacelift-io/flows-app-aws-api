import { AppBlock, events } from "@slflows/sdk/v1";
import { WAFClient, DeleteRegexPatternSetCommand } from "@aws-sdk/client-waf";

const deleteRegexPatternSet: AppBlock = {
  name: "Delete Regex Pattern Set",
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
            "The RegexPatternSetId of the RegexPatternSet that you want to delete.",
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

        const command = new DeleteRegexPatternSetCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Regex Pattern Set Result",
      description: "Result from DeleteRegexPatternSet operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ChangeToken: {
            type: "string",
            description:
              "The ChangeToken that you used to submit the DeleteRegexPatternSet request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteRegexPatternSet;
