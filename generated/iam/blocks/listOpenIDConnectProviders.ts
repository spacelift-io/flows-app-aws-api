import { AppBlock, events } from "@slflows/sdk/v1";
import {
  IAMClient,
  ListOpenIDConnectProvidersCommand,
} from "@aws-sdk/client-iam";

const listOpenIDConnectProviders: AppBlock = {
  name: "List Open ID Connect Providers",
  description:
    "Lists information about the IAM OpenID Connect (OIDC) provider resource objects defined in the Amazon Web Services account.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
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

        const command = new ListOpenIDConnectProvidersCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Open ID Connect Providers Result",
      description: "Result from ListOpenIDConnectProviders operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          OpenIDConnectProviderList: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Arn: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "The list of IAM OIDC provider resource objects defined in the Amazon Web Services account.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listOpenIDConnectProviders;
