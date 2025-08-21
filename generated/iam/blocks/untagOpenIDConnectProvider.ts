import { AppBlock, events } from "@slflows/sdk/v1";
import {
  IAMClient,
  UntagOpenIDConnectProviderCommand,
} from "@aws-sdk/client-iam";

const untagOpenIDConnectProvider: AppBlock = {
  name: "Untag Open ID Connect Provider",
  description:
    "Removes the specified tags from the specified OpenID Connect (OIDC)-compatible identity provider in IAM.",
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
            "The ARN of the OIDC provider in IAM from which you want to remove tags.",
          type: "string",
          required: true,
        },
        TagKeys: {
          name: "Tag Keys",
          description: "A list of key names as a simple array of strings.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new UntagOpenIDConnectProviderCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Untag Open ID Connect Provider Result",
      description: "Result from UntagOpenIDConnectProvider operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default untagOpenIDConnectProvider;
