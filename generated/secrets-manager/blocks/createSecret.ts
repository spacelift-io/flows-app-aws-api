import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SecretsManagerClient,
  CreateSecretCommand,
} from "@aws-sdk/client-secrets-manager";

const createSecret: AppBlock = {
  name: "Create Secret",
  description: "Creates a new secret.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Name: {
          name: "Name",
          description: "The name of the new secret.",
          type: "string",
          required: true,
        },
        ClientRequestToken: {
          name: "Client Request Token",
          description:
            "If you include SecretString or SecretBinary, then Secrets Manager creates an initial version for the secret, and this parameter specifies the unique identifier for the new version.",
          type: "string",
          required: false,
        },
        Description: {
          name: "Description",
          description: "The description of the secret.",
          type: "string",
          required: false,
        },
        KmsKeyId: {
          name: "Kms Key Id",
          description:
            "The ARN, key ID, or alias of the KMS key that Secrets Manager uses to encrypt the secret value in the secret.",
          type: "string",
          required: false,
        },
        SecretBinary: {
          name: "Secret Binary",
          description:
            "The binary data to encrypt and store in the new version of the secret.",
          type: "string",
          required: false,
        },
        SecretString: {
          name: "Secret String",
          description:
            "The text data to encrypt and store in this new version of the secret.",
          type: "string",
          required: false,
        },
        Tags: {
          name: "Tags",
          description: "A list of tags to attach to the secret.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Key: {
                  type: "string",
                },
                Value: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
          },
          required: false,
        },
        AddReplicaRegions: {
          name: "Add Replica Regions",
          description: "A list of Regions and KMS keys to replicate secrets.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Region: {
                  type: "string",
                },
                KmsKeyId: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
          },
          required: false,
        },
        ForceOverwriteReplicaSecret: {
          name: "Force Overwrite Replica Secret",
          description:
            "Specifies whether to overwrite a secret with the same name in the destination Region.",
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

        const command = new CreateSecretCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Secret Result",
      description: "Result from CreateSecret operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ARN: {
            type: "string",
            description: "The ARN of the new secret.",
          },
          Name: {
            type: "string",
            description: "The name of the new secret.",
          },
          VersionId: {
            type: "string",
            description:
              "The unique identifier associated with the version of the new secret.",
          },
          ReplicationStatus: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Region: {
                  type: "string",
                },
                KmsKeyId: {
                  type: "string",
                },
                Status: {
                  type: "string",
                },
                StatusMessage: {
                  type: "string",
                },
                LastAccessedDate: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "A list of the replicas of this secret and their status: Failed, which indicates that the replica was not created.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createSecret;
