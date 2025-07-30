import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, UntagSAMLProviderCommand } from "@aws-sdk/client-iam";

const untagSAMLProvider: AppBlock = {
  name: "Untag SAML Provider",
  description:
    "Removes the specified tags from the specified Security Assertion Markup Language (SAML) identity provider in IAM.",
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
            "The ARN of the SAML identity provider in IAM from which you want to remove tags.",
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
        });

        const command = new UntagSAMLProviderCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Untag SAML Provider Result",
      description: "Result from UntagSAMLProvider operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default untagSAMLProvider;
