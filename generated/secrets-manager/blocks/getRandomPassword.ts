import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SecretsManagerClient,
  GetRandomPasswordCommand,
} from "@aws-sdk/client-secrets-manager";

const getRandomPassword: AppBlock = {
  name: "Get Random Password",
  description: "Generates a random password.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        PasswordLength: {
          name: "Password Length",
          description: "The length of the password.",
          type: "number",
          required: false,
        },
        ExcludeCharacters: {
          name: "Exclude Characters",
          description:
            "A string of the characters that you don't want in the password.",
          type: "string",
          required: false,
        },
        ExcludeNumbers: {
          name: "Exclude Numbers",
          description:
            "Specifies whether to exclude numbers from the password.",
          type: "boolean",
          required: false,
        },
        ExcludePunctuation: {
          name: "Exclude Punctuation",
          description:
            "Specifies whether to exclude the following punctuation characters from the password: ! \" # $ % & ' ( ) * + , - .",
          type: "boolean",
          required: false,
        },
        ExcludeUppercase: {
          name: "Exclude Uppercase",
          description:
            "Specifies whether to exclude uppercase letters from the password.",
          type: "boolean",
          required: false,
        },
        ExcludeLowercase: {
          name: "Exclude Lowercase",
          description:
            "Specifies whether to exclude lowercase letters from the password.",
          type: "boolean",
          required: false,
        },
        IncludeSpace: {
          name: "Include Space",
          description: "Specifies whether to include the space character.",
          type: "boolean",
          required: false,
        },
        RequireEachIncludedType: {
          name: "Require Each Included Type",
          description:
            "Specifies whether to include at least one upper and lowercase letter, one number, and one punctuation.",
          type: "boolean",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new SecretsManagerClient({
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

        const command = new GetRandomPasswordCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Random Password Result",
      description: "Result from GetRandomPassword operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          RandomPassword: {
            type: "string",
            description: "A string with the password.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getRandomPassword;
