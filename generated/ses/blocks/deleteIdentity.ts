import { AppBlock, events } from "@slflows/sdk/v1";
import { SESClient, DeleteIdentityCommand } from "@aws-sdk/client-ses";

const deleteIdentity: AppBlock = {
  name: "Delete Identity",
  description:
    "Deletes the specified identity (an email address or a domain) from the list of verified identities.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Identity: {
          name: "Identity",
          description:
            "The identity to be removed from the list of identities for the Amazon Web Services account.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new SESClient({
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

        const command = new DeleteIdentityCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Identity Result",
      description: "Result from DeleteIdentity operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default deleteIdentity;
