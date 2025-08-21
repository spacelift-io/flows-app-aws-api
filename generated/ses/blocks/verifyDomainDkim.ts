import { AppBlock, events } from "@slflows/sdk/v1";
import { SESClient, VerifyDomainDkimCommand } from "@aws-sdk/client-ses";

const verifyDomainDkim: AppBlock = {
  name: "Verify Domain Dkim",
  description: "Returns a set of DKIM tokens for a domain identity.",
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
          description:
            "The name of the domain to be verified for Easy DKIM signing.",
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

        const command = new VerifyDomainDkimCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Verify Domain Dkim Result",
      description: "Result from VerifyDomainDkim operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DkimTokens: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "A set of character strings that represent the domain's identity.",
          },
        },
        required: ["DkimTokens"],
      },
    },
  },
};

export default verifyDomainDkim;
