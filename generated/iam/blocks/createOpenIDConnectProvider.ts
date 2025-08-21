import { AppBlock, events } from "@slflows/sdk/v1";
import {
  IAMClient,
  CreateOpenIDConnectProviderCommand,
} from "@aws-sdk/client-iam";

const createOpenIDConnectProvider: AppBlock = {
  name: "Create Open ID Connect Provider",
  description:
    "Creates an IAM entity to describe an identity provider (IdP) that supports OpenID Connect (OIDC).",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Url: {
          name: "Url",
          description: "The URL of the identity provider.",
          type: "string",
          required: true,
        },
        ClientIDList: {
          name: "Client ID List",
          description:
            "Provides a list of client IDs, also known as audiences.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        ThumbprintList: {
          name: "Thumbprint List",
          description:
            "A list of server certificate thumbprints for the OpenID Connect (OIDC) identity provider's server certificates.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        Tags: {
          name: "Tags",
          description:
            "A list of tags that you want to attach to the new IAM OpenID Connect (OIDC) provider.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Key: {
                  type: "string",
                },
                Value: {
                  type: "string",
                },
              },
              required: ["Key", "Value"],
              additionalProperties: false,
            },
          },
          required: false,
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

        const command = new CreateOpenIDConnectProviderCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Open ID Connect Provider Result",
      description: "Result from CreateOpenIDConnectProvider operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          OpenIDConnectProviderArn: {
            type: "string",
            description:
              "The Amazon Resource Name (ARN) of the new IAM OpenID Connect provider that is created.",
          },
          Tags: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Key: {
                  type: "string",
                },
                Value: {
                  type: "string",
                },
              },
              required: ["Key", "Value"],
              additionalProperties: false,
            },
            description:
              "A list of tags that are attached to the new IAM OIDC provider.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createOpenIDConnectProvider;
