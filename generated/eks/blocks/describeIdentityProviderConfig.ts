import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EKSClient,
  DescribeIdentityProviderConfigCommand,
} from "@aws-sdk/client-eks";

const describeIdentityProviderConfig: AppBlock = {
  name: "Describe Identity Provider Config",
  description: "Describes an identity provider configuration.",
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
        identityProviderConfig: {
          name: "identity Provider Config",
          description:
            "An object representing an identity provider configuration.",
          type: {
            type: "object",
            properties: {
              type: {
                type: "string",
              },
              name: {
                type: "string",
              },
            },
            required: ["type", "name"],
            additionalProperties: false,
          },
          required: true,
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
        });

        const command = new DescribeIdentityProviderConfigCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Identity Provider Config Result",
      description: "Result from DescribeIdentityProviderConfig operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          identityProviderConfig: {
            type: "object",
            properties: {
              oidc: {
                type: "object",
                properties: {
                  identityProviderConfigName: {
                    type: "string",
                  },
                  identityProviderConfigArn: {
                    type: "string",
                  },
                  clusterName: {
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
                  tags: {
                    type: "object",
                    additionalProperties: {
                      type: "string",
                    },
                  },
                  status: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
            },
            additionalProperties: false,
            description:
              "The object that represents an OpenID Connect (OIDC) identity provider configuration.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeIdentityProviderConfig;
