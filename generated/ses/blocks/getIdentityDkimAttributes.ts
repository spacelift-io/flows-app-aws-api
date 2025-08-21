import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SESClient,
  GetIdentityDkimAttributesCommand,
} from "@aws-sdk/client-ses";

const getIdentityDkimAttributes: AppBlock = {
  name: "Get Identity Dkim Attributes",
  description: "Returns the current status of Easy DKIM signing for an entity.",
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
          description:
            "A list of one or more verified identities - email addresses, domains, or both.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new GetIdentityDkimAttributesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Identity Dkim Attributes Result",
      description: "Result from GetIdentityDkimAttributes operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DkimAttributes: {
            type: "object",
            additionalProperties: {
              type: "object",
            },
            description:
              "The DKIM attributes for an email address or a domain.",
          },
        },
        required: ["DkimAttributes"],
      },
    },
  },
};

export default getIdentityDkimAttributes;
