import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SESClient,
  DeleteCustomVerificationEmailTemplateCommand,
} from "@aws-sdk/client-ses";

const deleteCustomVerificationEmailTemplate: AppBlock = {
  name: "Delete Custom Verification Email Template",
  description: "Deletes an existing custom verification email template.",
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
            "The name of the custom verification email template to delete.",
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

        const command = new DeleteCustomVerificationEmailTemplateCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Custom Verification Email Template Result",
      description:
        "Result from DeleteCustomVerificationEmailTemplate operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteCustomVerificationEmailTemplate;
