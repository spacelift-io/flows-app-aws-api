import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SecretsManagerClient,
  StopReplicationToReplicaCommand,
} from "@aws-sdk/client-secrets-manager";

const stopReplicationToReplica: AppBlock = {
  name: "Stop Replication To Replica",
  description:
    "Removes the link between the replica secret and the primary secret and promotes the replica to a primary secret in the replica Region.",
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
          description: "The ARN of the primary secret.",
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

        const command = new StopReplicationToReplicaCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Stop Replication To Replica Result",
      description: "Result from StopReplicationToReplica operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ARN: {
            type: "string",
            description: "The ARN of the promoted secret.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default stopReplicationToReplica;
