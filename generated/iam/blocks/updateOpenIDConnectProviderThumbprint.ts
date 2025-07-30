import { AppBlock, events } from "@slflows/sdk/v1";
import {
  IAMClient,
  UpdateOpenIDConnectProviderThumbprintCommand,
} from "@aws-sdk/client-iam";

const updateOpenIDConnectProviderThumbprint: AppBlock = {
  name: "Update Open ID Connect Provider Thumbprint",
  description:
    "Replaces the existing list of server certificate thumbprints associated with an OpenID Connect (OIDC) provider resource object with a new list of thumbprints.",
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
            "The Amazon Resource Name (ARN) of the IAM OIDC provider resource object for which you want to update the thumbprint.",
          type: "string",
          required: true,
        },
        ThumbprintList: {
          name: "Thumbprint List",
          description:
            "A list of certificate thumbprints that are associated with the specified IAM OpenID Connect provider.",
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

        const client = new IAMClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new UpdateOpenIDConnectProviderThumbprintCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Open ID Connect Provider Thumbprint Result",
      description:
        "Result from UpdateOpenIDConnectProviderThumbprint operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default updateOpenIDConnectProviderThumbprint;
