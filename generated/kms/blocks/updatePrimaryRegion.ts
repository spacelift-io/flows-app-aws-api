import { AppBlock, events } from "@slflows/sdk/v1";
import { KMSClient, UpdatePrimaryRegionCommand } from "@aws-sdk/client-kms";

const updatePrimaryRegion: AppBlock = {
  name: "Update Primary Region",
  description: "Changes the primary key of a multi-Region key.",
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
          description: "Identifies the current primary key.",
          type: "string",
          required: true,
        },
        PrimaryRegion: {
          name: "Primary Region",
          description: "The Amazon Web Services Region of the new primary key.",
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

        const command = new UpdatePrimaryRegionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Primary Region Result",
      description: "Result from UpdatePrimaryRegion operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default updatePrimaryRegion;
