import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, TagSAMLProviderCommand } from "@aws-sdk/client-iam";

const tagSAMLProvider: AppBlock = {
  name: "Tag SAML Provider",
  description:
    "Adds one or more tags to a Security Assertion Markup Language (SAML) identity provider.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        SAMLProviderArn: {
          name: "SAML Provider Arn",
          description:
            "The ARN of the SAML identity provider in IAM to which you want to add tags.",
          type: "string",
          required: true,
        },
        Tags: {
          name: "Tags",
          description:
            "The list of tags that you want to attach to the SAML identity provider in IAM.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new TagSAMLProviderCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Tag SAML Provider Result",
      description: "Result from TagSAMLProvider operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default tagSAMLProvider;
