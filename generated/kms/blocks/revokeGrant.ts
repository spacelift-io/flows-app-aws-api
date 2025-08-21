import { AppBlock, events } from "@slflows/sdk/v1";
import { KMSClient, RevokeGrantCommand } from "@aws-sdk/client-kms";

const revokeGrant: AppBlock = {
  name: "Revoke Grant",
  description: "Deletes the specified grant.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        KeyId: {
          name: "Key Id",
          description:
            "A unique identifier for the KMS key associated with the grant.",
          type: "string",
          required: true,
        },
        GrantId: {
          name: "Grant Id",
          description: "Identifies the grant to revoke.",
          type: "string",
          required: true,
        },
        DryRun: {
          name: "Dry Run",
          description: "Checks if your request will succeed.",
          type: "boolean",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new KMSClient({
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

        const command = new RevokeGrantCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Revoke Grant Result",
      description: "Result from RevokeGrant operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default revokeGrant;
