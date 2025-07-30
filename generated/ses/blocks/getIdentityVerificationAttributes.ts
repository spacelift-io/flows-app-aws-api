import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SESClient,
  GetIdentityVerificationAttributesCommand,
} from "@aws-sdk/client-ses";

const getIdentityVerificationAttributes: AppBlock = {
  name: "Get Identity Verification Attributes",
  description:
    "Given a list of identities (email addresses and/or domains), returns the verification status and (for domain identities) the verification token for each identity.",
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
          description: "A list of identities.",
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

        const command = new GetIdentityVerificationAttributesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Identity Verification Attributes Result",
      description: "Result from GetIdentityVerificationAttributes operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          VerificationAttributes: {
            type: "object",
            additionalProperties: {
              type: "object",
            },
            description:
              "A map of Identities to IdentityVerificationAttributes objects.",
          },
        },
        required: ["VerificationAttributes"],
      },
    },
  },
};

export default getIdentityVerificationAttributes;
