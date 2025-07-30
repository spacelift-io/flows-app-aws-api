import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SESClient,
  SendCustomVerificationEmailCommand,
} from "@aws-sdk/client-ses";

const sendCustomVerificationEmail: AppBlock = {
  name: "Send Custom Verification Email",
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
          description: "The email address to verify.",
          type: "string",
          required: true,
        },
        TemplateName: {
          name: "Template Name",
          description:
            "The name of the custom verification email template to use when sending the verification email.",
          type: "string",
          required: true,
        },
        ConfigurationSetName: {
          name: "Configuration Set Name",
          description:
            "Name of a configuration set to use when sending the verification email.",
          type: "string",
          required: false,
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

        const command = new SendCustomVerificationEmailCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Send Custom Verification Email Result",
      description: "Result from SendCustomVerificationEmail operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          MessageId: {
            type: "string",
            description:
              "The unique message identifier returned from the SendCustomVerificationEmail operation.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default sendCustomVerificationEmail;
