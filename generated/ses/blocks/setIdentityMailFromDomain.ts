import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SESClient,
  SetIdentityMailFromDomainCommand,
} from "@aws-sdk/client-ses";

const setIdentityMailFromDomain: AppBlock = {
  name: "Set Identity Mail From Domain",
  description:
    "Enables or disables the custom MAIL FROM domain setup for a verified identity (an email address or a domain).",
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
          description: "The verified identity.",
          type: "string",
          required: true,
        },
        MailFromDomain: {
          name: "Mail From Domain",
          description:
            "The custom MAIL FROM domain for the verified identity to use.",
          type: "string",
          required: false,
        },
        BehaviorOnMXFailure: {
          name: "Behavior On MX Failure",
          description:
            "The action for Amazon SES to take if it cannot successfully read the required MX record when you send an email.",
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

        const command = new SetIdentityMailFromDomainCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Set Identity Mail From Domain Result",
      description: "Result from SetIdentityMailFromDomain operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default setIdentityMailFromDomain;
