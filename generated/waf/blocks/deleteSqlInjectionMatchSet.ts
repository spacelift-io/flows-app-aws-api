import { AppBlock, events } from "@slflows/sdk/v1";
import {
  WAFClient,
  DeleteSqlInjectionMatchSetCommand,
} from "@aws-sdk/client-waf";

const deleteSqlInjectionMatchSet: AppBlock = {
  name: "Delete Sql Injection Match Set",
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
            "The SqlInjectionMatchSetId of the SqlInjectionMatchSet that you want to delete.",
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

        const command = new DeleteSqlInjectionMatchSetCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Sql Injection Match Set Result",
      description: "Result from DeleteSqlInjectionMatchSet operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ChangeToken: {
            type: "string",
            description:
              "The ChangeToken that you used to submit the DeleteSqlInjectionMatchSet request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteSqlInjectionMatchSet;
