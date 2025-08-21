import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SecretsManagerClient,
  ValidateResourcePolicyCommand,
} from "@aws-sdk/client-secrets-manager";

const validateResourcePolicy: AppBlock = {
  name: "Validate Resource Policy",
  description:
    "Validates that a resource policy does not grant a wide range of principals access to your secret.",
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
            "The ARN or name of the secret with the resource-based policy you want to validate.",
          type: "string",
          required: false,
        },
        ResourcePolicy: {
          name: "Resource Policy",
          description:
            "A JSON-formatted string that contains an Amazon Web Services resource-based policy.",
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

        const command = new ValidateResourcePolicyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Validate Resource Policy Result",
      description: "Result from ValidateResourcePolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          PolicyValidationPassed: {
            type: "boolean",
            description:
              "True if your policy passes validation, otherwise false.",
          },
          ValidationErrors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                CheckName: {
                  type: "string",
                },
                ErrorMessage: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "Validation errors if your policy didn't pass validation.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default validateResourcePolicy;
