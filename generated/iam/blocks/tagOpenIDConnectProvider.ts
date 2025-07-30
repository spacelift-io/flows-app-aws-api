import { AppBlock, events } from "@slflows/sdk/v1";
import {
  IAMClient,
  TagOpenIDConnectProviderCommand,
} from "@aws-sdk/client-iam";

const tagOpenIDConnectProvider: AppBlock = {
  name: "Tag Open ID Connect Provider",
  description:
    "Adds one or more tags to an OpenID Connect (OIDC)-compatible identity provider.",
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
            "The ARN of the OIDC identity provider in IAM to which you want to add tags.",
          type: "string",
          required: true,
        },
        Tags: {
          name: "Tags",
          description:
            "The list of tags that you want to attach to the OIDC identity provider in IAM.",
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

        const command = new TagOpenIDConnectProviderCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Tag Open ID Connect Provider Result",
      description: "Result from TagOpenIDConnectProvider operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default tagOpenIDConnectProvider;
