import { AppBlock, events } from "@slflows/sdk/v1";
import { KMSClient, RetireGrantCommand } from "@aws-sdk/client-kms";

const retireGrant: AppBlock = {
  name: "Retire Grant",
  description: "Deletes a grant.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        GrantToken: {
          name: "Grant Token",
          description: "Identifies the grant to be retired.",
          type: "string",
          required: false,
        },
        KeyId: {
          name: "Key Id",
          description: "The key ARN KMS key associated with the grant.",
          type: "string",
          required: false,
        },
        GrantId: {
          name: "Grant Id",
          description: "Identifies the grant to retire.",
          type: "string",
          required: false,
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

        const command = new RetireGrantCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Retire Grant Result",
      description: "Result from RetireGrant operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default retireGrant;
