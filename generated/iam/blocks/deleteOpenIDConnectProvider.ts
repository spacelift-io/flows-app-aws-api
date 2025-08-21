import { AppBlock, events } from "@slflows/sdk/v1";
import {
  IAMClient,
  DeleteOpenIDConnectProviderCommand,
} from "@aws-sdk/client-iam";

const deleteOpenIDConnectProvider: AppBlock = {
  name: "Delete Open ID Connect Provider",
  description:
    "Deletes an OpenID Connect identity provider (IdP) resource object in IAM.",
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
            "The Amazon Resource Name (ARN) of the IAM OpenID Connect provider resource object to delete.",
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

        const command = new DeleteOpenIDConnectProviderCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Open ID Connect Provider Result",
      description: "Result from DeleteOpenIDConnectProvider operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteOpenIDConnectProvider;
