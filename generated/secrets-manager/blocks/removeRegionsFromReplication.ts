import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SecretsManagerClient,
  RemoveRegionsFromReplicationCommand,
} from "@aws-sdk/client-secrets-manager";

const removeRegionsFromReplication: AppBlock = {
  name: "Remove Regions From Replication",
  description:
    "For a secret that is replicated to other Regions, deletes the secret replicas from the Regions you specify.",
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
          description: "The ARN or name of the secret.",
          type: "string",
          required: true,
        },
        RemoveReplicaRegions: {
          name: "Remove Replica Regions",
          description: "The Regions of the replicas to remove.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
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

        const command = new RemoveRegionsFromReplicationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Remove Regions From Replication Result",
      description: "Result from RemoveRegionsFromReplication operation",
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
            description:
              "The status of replicas for this secret after you remove Regions.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default removeRegionsFromReplication;
