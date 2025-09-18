import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  ModifyRedshiftIdcApplicationCommand,
} from "@aws-sdk/client-redshift";

const modifyRedshiftIdcApplication: AppBlock = {
  name: "Modify Redshift Idc Application",
  description: `Changes an existing Amazon Redshift IAM Identity Center application.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        RedshiftIdcApplicationArn: {
          name: "Redshift Idc Application Arn",
          description:
            "The ARN for the Redshift application that integrates with IAM Identity Center.",
          type: "string",
          required: true,
        },
        IdentityNamespace: {
          name: "Identity Namespace",
          description:
            "The namespace for the Amazon Redshift IAM Identity Center application to change.",
          type: "string",
          required: false,
        },
        IamRoleArn: {
          name: "Iam Role Arn",
          description:
            "The IAM role ARN associated with the Amazon Redshift IAM Identity Center application to change.",
          type: "string",
          required: false,
        },
        IdcDisplayName: {
          name: "Idc Display Name",
          description:
            "The display name for the Amazon Redshift IAM Identity Center application to change.",
          type: "string",
          required: false,
        },
        AuthorizedTokenIssuerList: {
          name: "Authorized Token Issuer List",
          description:
            "The authorized token issuer list for the Amazon Redshift IAM Identity Center application to change.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                TrustedTokenIssuerArn: {
                  type: "string",
                },
                AuthorizedAudiencesList: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              additionalProperties: false,
            },
          },
          required: false,
        },
        ServiceIntegrations: {
          name: "Service Integrations",
          description:
            "A collection of service integrations associated with the application.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new RedshiftClient({
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

        const command = new ModifyRedshiftIdcApplicationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Redshift Idc Application Result",
      description: "Result from ModifyRedshiftIdcApplication operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          RedshiftIdcApplication: {
            type: "object",
            properties: {
              IdcInstanceArn: {
                type: "string",
              },
              RedshiftIdcApplicationName: {
                type: "string",
              },
              RedshiftIdcApplicationArn: {
                type: "string",
              },
              IdentityNamespace: {
                type: "string",
              },
              IdcDisplayName: {
                type: "string",
              },
              IamRoleArn: {
                type: "string",
              },
              IdcManagedApplicationArn: {
                type: "string",
              },
              IdcOnboardStatus: {
                type: "string",
              },
              AuthorizedTokenIssuerList: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    TrustedTokenIssuerArn: {
                      type: "string",
                    },
                    AuthorizedAudiencesList: {
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
              ServiceIntegrations: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },
            additionalProperties: false,
            description:
              "Contains properties for the Redshift IDC application.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default modifyRedshiftIdcApplication;
