import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SecretsManagerClient,
  RotateSecretCommand,
} from "@aws-sdk/client-secrets-manager";

const rotateSecret: AppBlock = {
  name: "Rotate Secret",
  description:
    "Configures and starts the asynchronous process of rotating the secret.",
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
          description: "The ARN or name of the secret to rotate.",
          type: "string",
          required: true,
        },
        ClientRequestToken: {
          name: "Client Request Token",
          description: "A unique identifier for the new version of the secret.",
          type: "string",
          required: false,
        },
        RotationLambdaARN: {
          name: "Rotation Lambda ARN",
          description:
            "For secrets that use a Lambda rotation function to rotate, the ARN of the Lambda rotation function.",
          type: "string",
          required: false,
        },
        RotationRules: {
          name: "Rotation Rules",
          description:
            "A structure that defines the rotation configuration for this secret.",
          type: {
            type: "object",
            properties: {
              AutomaticallyAfterDays: {
                type: "number",
              },
              Duration: {
                type: "string",
              },
              ScheduleExpression: {
                type: "string",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        RotateImmediately: {
          name: "Rotate Immediately",
          description:
            "Specifies whether to rotate the secret immediately or wait until the next scheduled rotation window.",
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

        const command = new RotateSecretCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Rotate Secret Result",
      description: "Result from RotateSecret operation",
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
          VersionId: {
            type: "string",
            description: "The ID of the new version of the secret.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default rotateSecret;
