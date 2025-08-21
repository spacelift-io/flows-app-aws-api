import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SecretsManagerClient,
  RestoreSecretCommand,
} from "@aws-sdk/client-secrets-manager";

const restoreSecret: AppBlock = {
  name: "Restore Secret",
  description:
    "Cancels the scheduled deletion of a secret by removing the DeletedDate time stamp.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        SecretId: {
          name: "Secret Id",
          description: "The ARN or name of the secret to restore.",
          type: "string",
          required: true,
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

        const command = new RestoreSecretCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Restore Secret Result",
      description: "Result from RestoreSecret operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ARN: {
            type: "string",
            description: "The ARN of the secret that was restored.",
          },
          Name: {
            type: "string",
            description: "The name of the secret that was restored.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default restoreSecret;
