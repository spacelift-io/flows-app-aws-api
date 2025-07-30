import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, ListSAMLProvidersCommand } from "@aws-sdk/client-iam";

const listSAMLProviders: AppBlock = {
  name: "List SAML Providers",
  description:
    "Lists the SAML provider resource objects defined in IAM in the account.",
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
        });

        const command = new ListSAMLProvidersCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List SAML Providers Result",
      description: "Result from ListSAMLProviders operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          SAMLProviderList: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Arn: {
                  type: "string",
                },
                ValidUntil: {
                  type: "string",
                },
                CreateDate: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "The list of SAML provider resource objects defined in IAM for this Amazon Web Services account.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listSAMLProviders;
