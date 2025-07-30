import { AppBlock, events } from "@slflows/sdk/v1";
import { KMSClient, CreateAliasCommand } from "@aws-sdk/client-kms";

const createAlias: AppBlock = {
  name: "Create Alias",
  description: "Creates a friendly name for a KMS key.",
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
          description: "Specifies the alias name.",
          type: "string",
          required: true,
        },
        TargetKeyId: {
          name: "Target Key Id",
          description:
            "Associates the alias with the specified customer managed key.",
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

        const command = new CreateAliasCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Alias Result",
      description: "Result from CreateAlias operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default createAlias;
