import { AppBlock, events } from "@slflows/sdk/v1";
import {
  IAMClient,
  GetAccountPasswordPolicyCommand,
} from "@aws-sdk/client-iam";

const getAccountPasswordPolicy: AppBlock = {
  name: "Get Account Password Policy",
  description:
    "Retrieves the password policy for the Amazon Web Services account.",
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

        const command = new GetAccountPasswordPolicyCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Account Password Policy Result",
      description: "Result from GetAccountPasswordPolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          PasswordPolicy: {
            type: "object",
            properties: {
              MinimumPasswordLength: {
                type: "number",
              },
              RequireSymbols: {
                type: "boolean",
              },
              RequireNumbers: {
                type: "boolean",
              },
              RequireUppercaseCharacters: {
                type: "boolean",
              },
              RequireLowercaseCharacters: {
                type: "boolean",
              },
              AllowUsersToChangePassword: {
                type: "boolean",
              },
              ExpirePasswords: {
                type: "boolean",
              },
              MaxPasswordAge: {
                type: "number",
              },
              PasswordReusePrevention: {
                type: "number",
              },
              HardExpiry: {
                type: "boolean",
              },
            },
            additionalProperties: false,
            description:
              "A structure that contains details about the account's password policy.",
          },
        },
        required: ["PasswordPolicy"],
      },
    },
  },
};

export default getAccountPasswordPolicy;
