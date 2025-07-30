import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SecretsManagerClient,
  GetResourcePolicyCommand,
} from "@aws-sdk/client-secrets-manager";

const getResourcePolicy: AppBlock = {
  name: "Get Resource Policy",
  description:
    "Retrieves the JSON text of the resource-based policy document attached to the secret.",
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
            "The ARN or name of the secret to retrieve the attached resource-based policy for.",
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

        const command = new GetResourcePolicyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Resource Policy Result",
      description: "Result from GetResourcePolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ARN: {
            type: "string",
            description:
              "The ARN of the secret that the resource-based policy was retrieved for.",
          },
          Name: {
            type: "string",
            description:
              "The name of the secret that the resource-based policy was retrieved for.",
          },
          ResourcePolicy: {
            type: "string",
            description:
              "A JSON-formatted string that contains the permissions policy attached to the secret.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getResourcePolicy;
