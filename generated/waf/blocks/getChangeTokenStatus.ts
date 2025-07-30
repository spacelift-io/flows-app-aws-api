import { AppBlock, events } from "@slflows/sdk/v1";
import { WAFClient, GetChangeTokenStatusCommand } from "@aws-sdk/client-waf";

const getChangeTokenStatus: AppBlock = {
  name: "Get Change Token Status",
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
        ChangeToken: {
          name: "Change Token",
          description: "The change token for which you want to get the status.",
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

        const command = new GetChangeTokenStatusCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Change Token Status Result",
      description: "Result from GetChangeTokenStatus operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ChangeTokenStatus: {
            type: "string",
            description: "The status of the change token.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getChangeTokenStatus;
