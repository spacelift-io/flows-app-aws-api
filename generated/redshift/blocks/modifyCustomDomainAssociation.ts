import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  ModifyCustomDomainAssociationCommand,
} from "@aws-sdk/client-redshift";

const modifyCustomDomainAssociation: AppBlock = {
  name: "Modify Custom Domain Association",
  description: `Contains information for changing a custom domain association.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        CustomDomainName: {
          name: "Custom Domain Name",
          description:
            "The custom domain name for a changed custom domain association.",
          type: "string",
          required: true,
        },
        CustomDomainCertificateArn: {
          name: "Custom Domain Certificate Arn",
          description:
            "The certificate Amazon Resource Name (ARN) for the changed custom domain association.",
          type: "string",
          required: true,
        },
        ClusterIdentifier: {
          name: "Cluster Identifier",
          description:
            "The identifier of the cluster to change a custom domain association for.",
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

        const command = new ModifyCustomDomainAssociationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Custom Domain Association Result",
      description: "Result from ModifyCustomDomainAssociation operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          CustomDomainName: {
            type: "string",
            description:
              "The custom domain name associated with the result for the changed custom domain association.",
          },
          CustomDomainCertificateArn: {
            type: "string",
            description:
              "The certificate Amazon Resource Name (ARN) associated with the result for the changed custom domain association.",
          },
          ClusterIdentifier: {
            type: "string",
            description:
              "The identifier of the cluster associated with the result for the changed custom domain association.",
          },
          CustomDomainCertExpiryTime: {
            type: "string",
            description:
              "The certificate expiration time associated with the result for the changed custom domain association.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default modifyCustomDomainAssociation;
