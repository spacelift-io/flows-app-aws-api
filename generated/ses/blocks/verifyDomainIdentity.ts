import { AppBlock, events } from "@slflows/sdk/v1";
import { SESClient, VerifyDomainIdentityCommand } from "@aws-sdk/client-ses";

const verifyDomainIdentity: AppBlock = {
  name: "Verify Domain Identity",
  description:
    "Adds a domain to the list of identities for your Amazon SES account in the current Amazon Web Services Region and attempts to verify it.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Domain: {
          name: "Domain",
          description: "The domain to be verified.",
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

        const command = new VerifyDomainIdentityCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Verify Domain Identity Result",
      description: "Result from VerifyDomainIdentity operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          VerificationToken: {
            type: "string",
            description:
              "A TXT record that you must place in the DNS settings of the domain to complete domain verification with Amazon SES.",
          },
        },
        required: ["VerificationToken"],
      },
    },
  },
};

export default verifyDomainIdentity;
