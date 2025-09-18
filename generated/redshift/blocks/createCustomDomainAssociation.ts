import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  CreateCustomDomainAssociationCommand,
} from "@aws-sdk/client-redshift";

const createCustomDomainAssociation: AppBlock = {
  name: "Create Custom Domain Association",
  description: `Used to create a custom domain name for a cluster.`,
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
            "The custom domain name for a custom domain association.",
          type: "string",
          required: true,
        },
        CustomDomainCertificateArn: {
          name: "Custom Domain Certificate Arn",
          description:
            "The certificate Amazon Resource Name (ARN) for the custom domain name association.",
          type: "string",
          required: true,
        },
        ClusterIdentifier: {
          name: "Cluster Identifier",
          description:
            "The cluster identifier that the custom domain is associated with.",
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

        const command = new CreateCustomDomainAssociationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Custom Domain Association Result",
      description: "Result from CreateCustomDomainAssociation operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          CustomDomainName: {
            type: "string",
            description: "The custom domain name for the association result.",
          },
          CustomDomainCertificateArn: {
            type: "string",
            description:
              "The Amazon Resource Name (ARN) for the certificate associated with the custom domain name.",
          },
          ClusterIdentifier: {
            type: "string",
            description:
              "The identifier of the cluster that the custom domain is associated with.",
          },
          CustomDomainCertExpiryTime: {
            type: "string",
            description:
              "The expiration time for the certificate for the custom domain.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createCustomDomainAssociation;
