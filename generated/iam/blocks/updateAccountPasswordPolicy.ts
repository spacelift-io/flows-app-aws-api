import { AppBlock, events } from "@slflows/sdk/v1";
import {
  IAMClient,
  UpdateAccountPasswordPolicyCommand,
} from "@aws-sdk/client-iam";

const updateAccountPasswordPolicy: AppBlock = {
  name: "Update Account Password Policy",
  description:
    "Updates the password policy settings for the Amazon Web Services account.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        MinimumPasswordLength: {
          name: "Minimum Password Length",
          description:
            "The minimum number of characters allowed in an IAM user password.",
          type: "number",
          required: false,
        },
        RequireSymbols: {
          name: "Require Symbols",
          description:
            "Specifies whether IAM user passwords must contain at least one of the following non-alphanumeric characters: ! @ # $ % ^ & * ( ) _ + - = [ ] { } | ' If you do not specify a value for this parameter, then the operation uses the default value of false.",
          type: "boolean",
          required: false,
        },
        RequireNumbers: {
          name: "Require Numbers",
          description:
            "Specifies whether IAM user passwords must contain at least one numeric character (0 to 9).",
          type: "boolean",
          required: false,
        },
        RequireUppercaseCharacters: {
          name: "Require Uppercase Characters",
          description:
            "Specifies whether IAM user passwords must contain at least one uppercase character from the ISO basic Latin alphabet (A to Z).",
          type: "boolean",
          required: false,
        },
        RequireLowercaseCharacters: {
          name: "Require Lowercase Characters",
          description:
            "Specifies whether IAM user passwords must contain at least one lowercase character from the ISO basic Latin alphabet (a to z).",
          type: "boolean",
          required: false,
        },
        AllowUsersToChangePassword: {
          name: "Allow Users To Change Password",
          description:
            "Allows all IAM users in your account to use the Amazon Web Services Management Console to change their own passwords.",
          type: "boolean",
          required: false,
        },
        MaxPasswordAge: {
          name: "Max Password Age",
          description: "The number of days that an IAM user password is valid.",
          type: "number",
          required: false,
        },
        PasswordReusePrevention: {
          name: "Password Reuse Prevention",
          description:
            "Specifies the number of previous passwords that IAM users are prevented from reusing.",
          type: "number",
          required: false,
        },
        HardExpiry: {
          name: "Hard Expiry",
          description:
            "Prevents IAM users who are accessing the account via the Amazon Web Services Management Console from setting a new console password after their password has expired.",
          type: "boolean",
          required: false,
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
        });

        const command = new UpdateAccountPasswordPolicyCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Account Password Policy Result",
      description: "Result from UpdateAccountPasswordPolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default updateAccountPasswordPolicy;
