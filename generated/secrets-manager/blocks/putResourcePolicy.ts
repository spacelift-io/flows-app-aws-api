import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SecretsManagerClient,
  PutResourcePolicyCommand,
} from "@aws-sdk/client-secrets-manager";

const putResourcePolicy: AppBlock = {
  name: "Put Resource Policy",
  description: "Attaches a resource-based permission policy to a secret.",
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
            "The ARN or name of the secret to attach the resource-based policy.",
          type: "string",
          required: true,
        },
        ResourcePolicy: {
          name: "Resource Policy",
          description:
            "A JSON-formatted string for an Amazon Web Services resource-based policy.",
          type: "string",
          required: true,
        },
        BlockPublicPolicy: {
          name: "Block Public Policy",
          description:
            "Specifies whether to block resource-based policies that allow broad access to the secret, for example those that use a wildcard for the principal.",
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
        });

        const command = new PutResourcePolicyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Resource Policy Result",
      description: "Result from PutResourcePolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ARN: {
            type: "string",
            description: "The ARN of the secret.",
          },
          Name: {
            type: "string",
            description: "The name of the secret.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default putResourcePolicy;
