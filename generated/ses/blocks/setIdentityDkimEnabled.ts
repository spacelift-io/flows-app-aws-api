import { AppBlock, events } from "@slflows/sdk/v1";
import { SESClient, SetIdentityDkimEnabledCommand } from "@aws-sdk/client-ses";

const setIdentityDkimEnabled: AppBlock = {
  name: "Set Identity Dkim Enabled",
  description:
    "Enables or disables Easy DKIM signing of email sent from an identity.",
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
            "The identity for which DKIM signing should be enabled or disabled.",
          type: "string",
          required: true,
        },
        DkimEnabled: {
          name: "Dkim Enabled",
          description: "Sets whether DKIM signing is enabled for an identity.",
          type: "boolean",
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
        });

        const command = new SetIdentityDkimEnabledCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Set Identity Dkim Enabled Result",
      description: "Result from SetIdentityDkimEnabled operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default setIdentityDkimEnabled;
