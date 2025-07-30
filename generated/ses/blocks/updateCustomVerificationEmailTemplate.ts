import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SESClient,
  UpdateCustomVerificationEmailTemplateCommand,
} from "@aws-sdk/client-ses";

const updateCustomVerificationEmailTemplate: AppBlock = {
  name: "Update Custom Verification Email Template",
  description: "Updates an existing custom verification email template.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TemplateName: {
          name: "Template Name",
          description:
            "The name of the custom verification email template to update.",
          type: "string",
          required: true,
        },
        FromEmailAddress: {
          name: "From Email Address",
          description:
            "The email address that the custom verification email is sent from.",
          type: "string",
          required: false,
        },
        TemplateSubject: {
          name: "Template Subject",
          description: "The subject line of the custom verification email.",
          type: "string",
          required: false,
        },
        TemplateContent: {
          name: "Template Content",
          description: "The content of the custom verification email.",
          type: "string",
          required: false,
        },
        SuccessRedirectionURL: {
          name: "Success Redirection URL",
          description:
            "The URL that the recipient of the verification email is sent to if his or her address is successfully verified.",
          type: "string",
          required: false,
        },
        FailureRedirectionURL: {
          name: "Failure Redirection URL",
          description:
            "The URL that the recipient of the verification email is sent to if his or her address is not successfully verified.",
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

        const command = new UpdateCustomVerificationEmailTemplateCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Custom Verification Email Template Result",
      description:
        "Result from UpdateCustomVerificationEmailTemplate operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default updateCustomVerificationEmailTemplate;
