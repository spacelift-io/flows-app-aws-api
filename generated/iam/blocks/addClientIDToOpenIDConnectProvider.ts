import { AppBlock, events } from "@slflows/sdk/v1";
import {
  IAMClient,
  AddClientIDToOpenIDConnectProviderCommand,
} from "@aws-sdk/client-iam";

const addClientIDToOpenIDConnectProvider: AppBlock = {
  name: "Add Client ID To Open ID Connect Provider",
  description:
    "Adds a new client ID (also known as audience) to the list of client IDs already registered for the specified IAM OpenID Connect (OIDC) provider resource.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        OpenIDConnectProviderArn: {
          name: "Open ID Connect Provider Arn",
          description:
            "The Amazon Resource Name (ARN) of the IAM OpenID Connect (OIDC) provider resource to add the client ID to.",
          type: "string",
          required: true,
        },
        ClientID: {
          name: "Client ID",
          description:
            "The client ID (also known as audience) to add to the IAM OpenID Connect provider resource.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new IAMClient({
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

        const command = new AddClientIDToOpenIDConnectProviderCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Add Client ID To Open ID Connect Provider Result",
      description: "Result from AddClientIDToOpenIDConnectProvider operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default addClientIDToOpenIDConnectProvider;
