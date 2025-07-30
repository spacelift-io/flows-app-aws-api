import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SecretsManagerClient,
  ListSecretsCommand,
} from "@aws-sdk/client-secrets-manager";

const listSecrets: AppBlock = {
  name: "List Secrets",
  description:
    "Lists the secrets that are stored by Secrets Manager in the Amazon Web Services account, not including secrets that are marked for deletion.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        IncludePlannedDeletion: {
          name: "Include Planned Deletion",
          description:
            "Specifies whether to include secrets scheduled for deletion.",
          type: "boolean",
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
        Filters: {
          name: "Filters",
          description: "The filters to apply to the list of secrets.",
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
        SortOrder: {
          name: "Sort Order",
          description: "Secrets are listed by CreatedDate.",
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

        const command = new ListSecretsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Secrets Result",
      description: "Result from ListSecrets operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          SecretList: {
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
                Description: {
                  type: "string",
                },
                KmsKeyId: {
                  type: "string",
                },
                RotationEnabled: {
                  type: "boolean",
                },
                RotationLambdaARN: {
                  type: "string",
                },
                RotationRules: {
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
                LastRotatedDate: {
                  type: "string",
                },
                LastChangedDate: {
                  type: "string",
                },
                LastAccessedDate: {
                  type: "string",
                },
                DeletedDate: {
                  type: "string",
                },
                NextRotationDate: {
                  type: "string",
                },
                Tags: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Key: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Value: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                SecretVersionsToStages: {
                  type: "object",
                  additionalProperties: {
                    type: "array",
                  },
                },
                OwningService: {
                  type: "string",
                },
                CreatedDate: {
                  type: "string",
                },
                PrimaryRegion: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "A list of the secrets in the account.",
          },
          NextToken: {
            type: "string",
            description:
              "Secrets Manager includes this value if there's more output available than what is included in the current response.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listSecrets;
