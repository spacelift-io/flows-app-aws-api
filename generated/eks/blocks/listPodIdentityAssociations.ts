import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EKSClient,
  ListPodIdentityAssociationsCommand,
} from "@aws-sdk/client-eks";

const listPodIdentityAssociations: AppBlock = {
  name: "List Pod Identity Associations",
  description: "List the EKS Pod Identity associations in a cluster.",
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
          description: "The name of the cluster that the associations are in.",
          type: "string",
          required: true,
        },
        namespace: {
          name: "namespace",
          description:
            "The name of the Kubernetes namespace inside the cluster that the associations are in.",
          type: "string",
          required: false,
        },
        serviceAccount: {
          name: "service Account",
          description:
            "The name of the Kubernetes service account that the associations use.",
          type: "string",
          required: false,
        },
        maxResults: {
          name: "max Results",
          description:
            "The maximum number of EKS Pod Identity association results returned by ListPodIdentityAssociations in paginated output.",
          type: "number",
          required: false,
        },
        nextToken: {
          name: "next Token",
          description:
            "The nextToken value returned from a previous paginated ListUpdates request where maxResults was used and the results exceeded the value of that parameter.",
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

        const command = new ListPodIdentityAssociationsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Pod Identity Associations Result",
      description: "Result from ListPodIdentityAssociations operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          associations: {
            type: "array",
            items: {
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
                associationArn: {
                  type: "string",
                },
                associationId: {
                  type: "string",
                },
                ownerArn: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "The list of summarized descriptions of the associations that are in the cluster and match any filters that you provided.",
          },
          nextToken: {
            type: "string",
            description:
              "The nextToken value to include in a future ListPodIdentityAssociations request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listPodIdentityAssociations;
