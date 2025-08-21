import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SESClient,
  ListCustomVerificationEmailTemplatesCommand,
} from "@aws-sdk/client-ses";

const listCustomVerificationEmailTemplates: AppBlock = {
  name: "List Custom Verification Email Templates",
  description:
    "Lists the existing custom verification email templates for your account in the current Amazon Web Services Region.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        NextToken: {
          name: "Next Token",
          description:
            "An array the contains the name and creation time stamp for each template in your Amazon SES account.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of custom verification email templates to return.",
          type: "number",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new ListCustomVerificationEmailTemplatesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Custom Verification Email Templates Result",
      description: "Result from ListCustomVerificationEmailTemplates operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          CustomVerificationEmailTemplates: {
            type: "array",
            items: {
              type: "object",
              properties: {
                TemplateName: {
                  type: "string",
                },
                FromEmailAddress: {
                  type: "string",
                },
                TemplateSubject: {
                  type: "string",
                },
                SuccessRedirectionURL: {
                  type: "string",
                },
                FailureRedirectionURL: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "A list of the custom verification email templates that exist in your account.",
          },
          NextToken: {
            type: "string",
            description:
              "A token indicating that there are additional custom verification email templates available to be listed.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listCustomVerificationEmailTemplates;
