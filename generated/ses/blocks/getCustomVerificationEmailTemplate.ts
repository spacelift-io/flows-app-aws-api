import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SESClient,
  GetCustomVerificationEmailTemplateCommand,
} from "@aws-sdk/client-ses";

const getCustomVerificationEmailTemplate: AppBlock = {
  name: "Get Custom Verification Email Template",
  description:
    "Returns the custom email verification template for the template name you specify.",
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
            "The name of the custom verification email template to retrieve.",
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
        });

        const command = new GetCustomVerificationEmailTemplateCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Custom Verification Email Template Result",
      description: "Result from GetCustomVerificationEmailTemplate operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TemplateName: {
            type: "string",
            description: "The name of the custom verification email template.",
          },
          FromEmailAddress: {
            type: "string",
            description:
              "The email address that the custom verification email is sent from.",
          },
          TemplateSubject: {
            type: "string",
            description: "The subject line of the custom verification email.",
          },
          TemplateContent: {
            type: "string",
            description: "The content of the custom verification email.",
          },
          SuccessRedirectionURL: {
            type: "string",
            description:
              "The URL that the recipient of the verification email is sent to if his or her address is successfully verified.",
          },
          FailureRedirectionURL: {
            type: "string",
            description:
              "The URL that the recipient of the verification email is sent to if his or her address is not successfully verified.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getCustomVerificationEmailTemplate;
