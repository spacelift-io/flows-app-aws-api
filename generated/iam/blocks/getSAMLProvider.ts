import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, GetSAMLProviderCommand } from "@aws-sdk/client-iam";

const getSAMLProvider: AppBlock = {
  name: "Get SAML Provider",
  description:
    "Returns the SAML provider metadocument that was uploaded when the IAM SAML provider resource object was created or updated.",
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
            "The Amazon Resource Name (ARN) of the SAML provider resource object in IAM to get information about.",
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

        const command = new GetSAMLProviderCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get SAML Provider Result",
      description: "Result from GetSAMLProvider operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          SAMLProviderUUID: {
            type: "string",
            description: "The unique identifier assigned to the SAML provider.",
          },
          SAMLMetadataDocument: {
            type: "string",
            description:
              "The XML metadata document that includes information about an identity provider.",
          },
          CreateDate: {
            type: "string",
            description:
              "The date and time when the SAML provider was created.",
          },
          ValidUntil: {
            type: "string",
            description: "The expiration date and time for the SAML provider.",
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
              "A list of tags that are attached to the specified IAM SAML provider.",
          },
          AssertionEncryptionMode: {
            type: "string",
            description:
              "Specifies the encryption setting for the SAML provider.",
          },
          PrivateKeyList: {
            type: "array",
            items: {
              type: "object",
              properties: {
                KeyId: {
                  type: "string",
                },
                Timestamp: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "The private key metadata for the SAML provider.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getSAMLProvider;
