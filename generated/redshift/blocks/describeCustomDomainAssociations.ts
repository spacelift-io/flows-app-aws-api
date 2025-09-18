import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  DescribeCustomDomainAssociationsCommand,
} from "@aws-sdk/client-redshift";

const describeCustomDomainAssociations: AppBlock = {
  name: "Describe Custom Domain Associations",
  description: `Contains information about custom domain associations for a cluster.`,
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
            "The custom domain name for the custom domain association.",
          type: "string",
          required: false,
        },
        CustomDomainCertificateArn: {
          name: "Custom Domain Certificate Arn",
          description:
            "The certificate Amazon Resource Name (ARN) for the custom domain association.",
          type: "string",
          required: false,
        },
        MaxRecords: {
          name: "Max Records",
          description:
            "The maximum records setting for the associated custom domain.",
          type: "number",
          required: false,
        },
        Marker: {
          name: "Marker",
          description: "The marker for the custom domain association.",
          type: "string",
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

        const command = new DescribeCustomDomainAssociationsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Custom Domain Associations Result",
      description: "Result from DescribeCustomDomainAssociations operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Marker: {
            type: "string",
            description: "The marker for the custom domain association.",
          },
          Associations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                CustomDomainCertificateArn: {
                  type: "string",
                },
                CustomDomainCertificateExpiryDate: {
                  type: "string",
                },
                CertificateAssociations: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      CustomDomainName: {
                        type: "object",
                        additionalProperties: true,
                      },
                      ClusterIdentifier: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
              },
              additionalProperties: false,
            },
            description: "The associations for the custom domain.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeCustomDomainAssociations;
