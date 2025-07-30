import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EKSClient,
  CreatePodIdentityAssociationCommand,
} from "@aws-sdk/client-eks";

const createPodIdentityAssociation: AppBlock = {
  name: "Create Pod Identity Association",
  description:
    "Creates an EKS Pod Identity association between a service account in an Amazon EKS cluster and an IAM role with EKS Pod Identity.",
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
          description:
            "The name of the cluster to create the EKS Pod Identity association in.",
          type: "string",
          required: true,
        },
        namespace: {
          name: "namespace",
          description:
            "The name of the Kubernetes namespace inside the cluster to create the EKS Pod Identity association in.",
          type: "string",
          required: true,
        },
        serviceAccount: {
          name: "service Account",
          description:
            "The name of the Kubernetes service account inside the cluster to associate the IAM credentials with.",
          type: "string",
          required: true,
        },
        roleArn: {
          name: "role Arn",
          description:
            "The Amazon Resource Name (ARN) of the IAM role to associate with the service account.",
          type: "string",
          required: true,
        },
        clientRequestToken: {
          name: "client Request Token",
          description:
            "A unique, case-sensitive identifier that you provide to ensure the idempotency of the request.",
          type: "string",
          required: false,
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
        disableSessionTags: {
          name: "disable Session Tags",
          description:
            "Disable the automatic sessions tags that are appended by EKS Pod Identity.",
          type: "boolean",
          required: false,
        },
        targetRoleArn: {
          name: "target Role Arn",
          description:
            "The Amazon Resource Name (ARN) of the target IAM role to associate with the service account.",
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
        });

        const command = new CreatePodIdentityAssociationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Pod Identity Association Result",
      description: "Result from CreatePodIdentityAssociation operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          association: {
            type: "object",
            properties: {
              clusterName: {
                type: "string",
              },
              namespace: {
                type: "string",
              },
              serviceAccount: {
                type: "string",
              },
              roleArn: {
                type: "string",
              },
              associationArn: {
                type: "string",
              },
              associationId: {
                type: "string",
              },
              tags: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
              },
              createdAt: {
                type: "string",
              },
              modifiedAt: {
                type: "string",
              },
              ownerArn: {
                type: "string",
              },
              disableSessionTags: {
                type: "boolean",
              },
              targetRoleArn: {
                type: "string",
              },
              externalId: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "The full description of your new association.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createPodIdentityAssociation;
