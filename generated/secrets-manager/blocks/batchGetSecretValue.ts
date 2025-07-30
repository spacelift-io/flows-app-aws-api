import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SecretsManagerClient,
  BatchGetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

const batchGetSecretValue: AppBlock = {
  name: "Batch Get Secret Value",
  description:
    "Retrieves the contents of the encrypted fields SecretString or SecretBinary for up to 20 secrets.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        SecretIdList: {
          name: "Secret Id List",
          description: "The ARN or names of the secrets to retrieve.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        Filters: {
          name: "Filters",
          description: "The filters to choose which secrets to retrieve.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Key: {
                  type: "string",
                },
                Values: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              additionalProperties: false,
            },
          },
          required: false,
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

        const command = new BatchGetSecretValueCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Batch Get Secret Value Result",
      description: "Result from BatchGetSecretValue operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          SecretValues: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ARN: {
                  type: "string",
                },
                Name: {
                  type: "string",
                },
                VersionId: {
                  type: "string",
                },
                SecretBinary: {
                  type: "string",
                },
                SecretString: {
                  type: "string",
                },
                VersionStages: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                CreatedDate: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "A list of secret values.",
          },
          NextToken: {
            type: "string",
            description:
              "Secrets Manager includes this value if there's more output available than what is included in the current response.",
          },
          Errors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                SecretId: {
                  type: "string",
                },
                ErrorCode: {
                  type: "string",
                },
                Message: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "A list of errors Secrets Manager encountered while attempting to retrieve individual secrets.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default batchGetSecretValue;
