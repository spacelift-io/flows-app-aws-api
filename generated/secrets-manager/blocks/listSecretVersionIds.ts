import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SecretsManagerClient,
  ListSecretVersionIdsCommand,
} from "@aws-sdk/client-secrets-manager";

const listSecretVersionIds: AppBlock = {
  name: "List Secret Version Ids",
  description: "Lists the versions of a secret.",
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
            "The ARN or name of the secret whose versions you want to list.",
          type: "string",
          required: true,
        },
        MaxResults: {
          name: "Max Results",
          description: "The number of results to include in the response.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description:
            "A token that indicates where the output should continue from, if a previous call did not show all results.",
          type: "string",
          required: false,
        },
        IncludeDeprecated: {
          name: "Include Deprecated",
          description:
            "Specifies whether to include versions of secrets that don't have any staging labels attached to them.",
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

        const command = new ListSecretVersionIdsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Secret Version Ids Result",
      description: "Result from ListSecretVersionIds operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Versions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                VersionId: {
                  type: "string",
                },
                VersionStages: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                LastAccessedDate: {
                  type: "string",
                },
                CreatedDate: {
                  type: "string",
                },
                KmsKeyIds: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              additionalProperties: false,
            },
            description: "A list of the versions of the secret.",
          },
          NextToken: {
            type: "string",
            description:
              "Secrets Manager includes this value if there's more output available than what is included in the current response.",
          },
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

export default listSecretVersionIds;
