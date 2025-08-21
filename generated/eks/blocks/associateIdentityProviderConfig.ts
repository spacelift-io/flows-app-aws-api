import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EKSClient,
  AssociateIdentityProviderConfigCommand,
} from "@aws-sdk/client-eks";

const associateIdentityProviderConfig: AppBlock = {
  name: "Associate Identity Provider Config",
  description: "Associates an identity provider configuration to a cluster.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        clusterName: {
          name: "cluster Name",
          description: "The name of your cluster.",
          type: "string",
          required: true,
        },
        oidc: {
          name: "oidc",
          description:
            "An object representing an OpenID Connect (OIDC) identity provider configuration.",
          type: {
            type: "object",
            properties: {
              identityProviderConfigName: {
                type: "string",
              },
              issuerUrl: {
                type: "string",
              },
              clientId: {
                type: "string",
              },
              usernameClaim: {
                type: "string",
              },
              usernamePrefix: {
                type: "string",
              },
              groupsClaim: {
                type: "string",
              },
              groupsPrefix: {
                type: "string",
              },
              requiredClaims: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
              },
            },
            required: ["identityProviderConfigName", "issuerUrl", "clientId"],
            additionalProperties: false,
          },
          required: true,
        },
        tags: {
          name: "tags",
          description:
            "Metadata that assists with categorization and organization.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
          },
          required: false,
        },
        clientRequestToken: {
          name: "client Request Token",
          description:
            "A unique, case-sensitive identifier that you provide to ensure the idempotency of the request.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new EKSClient({
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

        const command = new AssociateIdentityProviderConfigCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Associate Identity Provider Config Result",
      description: "Result from AssociateIdentityProviderConfig operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          update: {
            type: "object",
            properties: {
              id: {
                type: "string",
              },
              status: {
                type: "string",
              },
              type: {
                type: "string",
              },
              params: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type: {
                      type: "string",
                    },
                    value: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              createdAt: {
                type: "string",
              },
              errors: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    errorCode: {
                      type: "string",
                    },
                    errorMessage: {
                      type: "string",
                    },
                    resourceIds: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                  },
                  additionalProperties: false,
                },
              },
            },
            additionalProperties: false,
            description: "An object representing an asynchronous update.",
          },
          tags: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description: "The tags for the resource.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default associateIdentityProviderConfig;
