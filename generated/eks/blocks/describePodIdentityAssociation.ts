import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EKSClient,
  DescribePodIdentityAssociationCommand,
} from "@aws-sdk/client-eks";

const describePodIdentityAssociation: AppBlock = {
  name: "Describe Pod Identity Association",
  description:
    "Returns descriptive information about an EKS Pod Identity association.",
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
          description: "The name of the cluster that the association is in.",
          type: "string",
          required: true,
        },
        associationId: {
          name: "association Id",
          description:
            "The ID of the association that you want the description of.",
          type: "string",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new DescribePodIdentityAssociationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Pod Identity Association Result",
      description: "Result from DescribePodIdentityAssociation operation",
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
              "The full description of the EKS Pod Identity association.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describePodIdentityAssociation;
