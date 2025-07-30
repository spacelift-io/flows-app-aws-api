import { AppBlock, events } from "@slflows/sdk/v1";
import { WAFClient, GetChangeTokenCommand } from "@aws-sdk/client-waf";

const getChangeToken: AppBlock = {
  name: "Get Change Token",
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

        const command = new GetChangeTokenCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Change Token Result",
      description: "Result from GetChangeToken operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ChangeToken: {
            type: "string",
            description: "The ChangeToken that you used in the request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getChangeToken;
