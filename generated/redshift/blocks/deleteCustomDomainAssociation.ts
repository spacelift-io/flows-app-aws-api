import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  DeleteCustomDomainAssociationCommand,
} from "@aws-sdk/client-redshift";

const deleteCustomDomainAssociation: AppBlock = {
  name: "Delete Custom Domain Association",
  description: `Contains information about deleting a custom domain association for a cluster.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ClusterIdentifier: {
          name: "Cluster Identifier",
          description:
            "The identifier of the cluster to delete a custom domain association for.",
          type: "string",
          required: true,
        },
        CustomDomainName: {
          name: "Custom Domain Name",
          description:
            "The custom domain name for the custom domain association.",
          type: "string",
          required: true,
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

        const command = new DeleteCustomDomainAssociationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Custom Domain Association Result",
      description: "Result from DeleteCustomDomainAssociation operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteCustomDomainAssociation;
