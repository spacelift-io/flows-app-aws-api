import { AppBlock, events } from "@slflows/sdk/v1";
import { SESClient, VerifyEmailAddressCommand } from "@aws-sdk/client-ses";

const verifyEmailAddress: AppBlock = {
  name: "Verify Email Address",
  description: "Deprecated.",
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

        const command = new VerifyEmailAddressCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Verify Email Address Result",
      description: "Result from VerifyEmailAddress operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default verifyEmailAddress;
