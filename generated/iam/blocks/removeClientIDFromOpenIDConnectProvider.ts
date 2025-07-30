import { AppBlock, events } from "@slflows/sdk/v1";
import {
  IAMClient,
  RemoveClientIDFromOpenIDConnectProviderCommand,
} from "@aws-sdk/client-iam";

const removeClientIDFromOpenIDConnectProvider: AppBlock = {
  name: "Remove Client ID From Open ID Connect Provider",
  description:
    "Removes the specified client ID (also known as audience) from the list of client IDs registered for the specified IAM OpenID Connect (OIDC) provider resource object.",
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
            "The Amazon Resource Name (ARN) of the IAM OIDC provider resource to remove the client ID from.",
          type: "string",
          required: true,
        },
        ClientID: {
          name: "Client ID",
          description:
            "The client ID (also known as audience) to remove from the IAM OIDC provider resource.",
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
        });

        const command = new RemoveClientIDFromOpenIDConnectProviderCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Remove Client ID From Open ID Connect Provider Result",
      description:
        "Result from RemoveClientIDFromOpenIDConnectProvider operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default removeClientIDFromOpenIDConnectProvider;
