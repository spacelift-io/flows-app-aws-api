import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, CreateAccountAliasCommand } from "@aws-sdk/client-iam";

const createAccountAlias: AppBlock = {
  name: "Create Account Alias",
  description: "Creates an alias for your Amazon Web Services account.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        AccountAlias: {
          name: "Account Alias",
          description: "The account alias to create.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new IAMClient({
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

        const command = new CreateAccountAliasCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Account Alias Result",
      description: "Result from CreateAccountAlias operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default createAccountAlias;
