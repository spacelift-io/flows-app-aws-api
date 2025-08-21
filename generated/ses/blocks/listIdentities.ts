import { AppBlock, events } from "@slflows/sdk/v1";
import { SESClient, ListIdentitiesCommand } from "@aws-sdk/client-ses";

const listIdentities: AppBlock = {
  name: "List Identities",
  description:
    "Returns a list containing all of the identities (email addresses and domains) for your Amazon Web Services account in the current Amazon Web Services Region, regardless of verification status.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        IdentityType: {
          name: "Identity Type",
          description: "The type of the identities to list.",
          type: "string",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token to use for pagination.",
          type: "string",
          required: false,
        },
        MaxItems: {
          name: "Max Items",
          description: "The maximum number of identities per page.",
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

        const command = new ListIdentitiesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Identities Result",
      description: "Result from ListIdentities operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Identities: {
            type: "array",
            items: {
              type: "string",
            },
            description: "A list of identities.",
          },
          NextToken: {
            type: "string",
            description: "The token used for pagination.",
          },
        },
        required: ["Identities"],
      },
    },
  },
};

export default listIdentities;
