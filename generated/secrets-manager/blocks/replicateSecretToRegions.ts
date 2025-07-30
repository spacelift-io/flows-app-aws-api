import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SecretsManagerClient,
  ReplicateSecretToRegionsCommand,
} from "@aws-sdk/client-secrets-manager";

const replicateSecretToRegions: AppBlock = {
  name: "Replicate Secret To Regions",
  description: "Replicates the secret to a new Regions.",
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
          description: "The ARN or name of the secret to replicate.",
          type: "string",
          required: true,
        },
        AddReplicaRegions: {
          name: "Add Replica Regions",
          description: "A list of Regions in which to replicate the secret.",
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
          required: true,
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

        const command = new ReplicateSecretToRegionsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Replicate Secret To Regions Result",
      description: "Result from ReplicateSecretToRegions operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ARN: {
            type: "string",
            description: "The ARN of the primary secret.",
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
            description: "The status of replication.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default replicateSecretToRegions;
