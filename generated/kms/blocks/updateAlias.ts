import { AppBlock, events } from "@slflows/sdk/v1";
import { KMSClient, UpdateAliasCommand } from "@aws-sdk/client-kms";

const updateAlias: AppBlock = {
  name: "Update Alias",
  description: "Associates an existing KMS alias with a different KMS key.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        AliasName: {
          name: "Alias Name",
          description: "Identifies the alias that is changing its KMS key.",
          type: "string",
          required: true,
        },
        TargetKeyId: {
          name: "Target Key Id",
          description:
            "Identifies the customer managed key to associate with the alias.",
          type: "string",
          required: true,
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
        });

        const command = new UpdateAliasCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Alias Result",
      description: "Result from UpdateAlias operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default updateAlias;
