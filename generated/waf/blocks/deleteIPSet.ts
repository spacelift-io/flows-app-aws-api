import { AppBlock, events } from "@slflows/sdk/v1";
import { WAFClient, DeleteIPSetCommand } from "@aws-sdk/client-waf";

const deleteIPSet: AppBlock = {
  name: "Delete IP Set",
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
        IPSetId: {
          name: "IP Set Id",
          description: "The IPSetId of the IPSet that you want to delete.",
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

        const command = new DeleteIPSetCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete IP Set Result",
      description: "Result from DeleteIPSet operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ChangeToken: {
            type: "string",
            description:
              "The ChangeToken that you used to submit the DeleteIPSet request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteIPSet;
