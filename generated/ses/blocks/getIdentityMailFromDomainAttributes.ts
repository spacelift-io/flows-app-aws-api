import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SESClient,
  GetIdentityMailFromDomainAttributesCommand,
} from "@aws-sdk/client-ses";

const getIdentityMailFromDomainAttributes: AppBlock = {
  name: "Get Identity Mail From Domain Attributes",
  description:
    "Returns the custom MAIL FROM attributes for a list of identities (email addresses : domains).",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Identities: {
          name: "Identities",
          description: "A list of one or more identities.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
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

        const command = new GetIdentityMailFromDomainAttributesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Identity Mail From Domain Attributes Result",
      description: "Result from GetIdentityMailFromDomainAttributes operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          MailFromDomainAttributes: {
            type: "object",
            additionalProperties: {
              type: "object",
            },
            description: "A map of identities to custom MAIL FROM attributes.",
          },
        },
        required: ["MailFromDomainAttributes"],
      },
    },
  },
};

export default getIdentityMailFromDomainAttributes;
