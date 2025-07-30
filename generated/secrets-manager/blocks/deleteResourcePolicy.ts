import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SecretsManagerClient,
  DeleteResourcePolicyCommand,
} from "@aws-sdk/client-secrets-manager";

const deleteResourcePolicy: AppBlock = {
  name: "Delete Resource Policy",
  description:
    "Deletes the resource-based permission policy attached to the secret.",
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
          description:
            "The ARN or name of the secret to delete the attached resource-based policy for.",
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
        });

        const command = new DeleteResourcePolicyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Resource Policy Result",
      description: "Result from DeleteResourcePolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ARN: {
            type: "string",
            description:
              "The ARN of the secret that the resource-based policy was deleted for.",
          },
          Name: {
            type: "string",
            description:
              "The name of the secret that the resource-based policy was deleted for.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteResourcePolicy;
