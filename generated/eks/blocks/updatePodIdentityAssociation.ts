import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EKSClient,
  UpdatePodIdentityAssociationCommand,
} from "@aws-sdk/client-eks";

const updatePodIdentityAssociation: AppBlock = {
  name: "Update Pod Identity Association",
  description: "Updates a EKS Pod Identity association.",
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
            "The name of the cluster that you want to update the association in.",
          type: "string",
          required: true,
        },
        associationId: {
          name: "association Id",
          description: "The ID of the association to be updated.",
          type: "string",
          required: true,
        },
        roleArn: {
          name: "role Arn",
          description: "The new IAM role to change in the association.",
          type: "string",
          required: false,
        },
        clientRequestToken: {
          name: "client Request Token",
          description:
            "A unique, case-sensitive identifier that you provide to ensure the idempotency of the request.",
          type: "string",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new UpdatePodIdentityAssociationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Pod Identity Association Result",
      description: "Result from UpdatePodIdentityAssociation operation",
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
            description:
              "The full description of the association that was updated.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updatePodIdentityAssociation;
