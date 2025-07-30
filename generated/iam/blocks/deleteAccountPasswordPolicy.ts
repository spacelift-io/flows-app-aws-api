import { AppBlock, events } from "@slflows/sdk/v1";
import {
  IAMClient,
  DeleteAccountPasswordPolicyCommand,
} from "@aws-sdk/client-iam";

const deleteAccountPasswordPolicy: AppBlock = {
  name: "Delete Account Password Policy",
  description:
    "Deletes the password policy for the Amazon Web Services account.",
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
        });

        const command = new DeleteAccountPasswordPolicyCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Account Password Policy Result",
      description: "Result from DeleteAccountPasswordPolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteAccountPasswordPolicy;
