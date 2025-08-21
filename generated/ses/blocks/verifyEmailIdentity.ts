import { AppBlock, events } from "@slflows/sdk/v1";
import { SESClient, VerifyEmailIdentityCommand } from "@aws-sdk/client-ses";

const verifyEmailIdentity: AppBlock = {
  name: "Verify Email Identity",
  description:
    "Adds an email address to the list of identities for your Amazon SES account in the current Amazon Web Services Region and attempts to verify it.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        EmailAddress: {
          name: "Email Address",
          description: "The email address to be verified.",
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

        const command = new VerifyEmailIdentityCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Verify Email Identity Result",
      description: "Result from VerifyEmailIdentity operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default verifyEmailIdentity;
