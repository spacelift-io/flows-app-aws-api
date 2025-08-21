import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, DescribeCertificatesCommand } from "@aws-sdk/client-rds";

const describeCertificates: AppBlock = {
  name: "Describe Certificates",
  description:
    "Lists the set of certificate authority (CA) certificates provided by Amazon RDS for this Amazon Web Services account.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        CertificateIdentifier: {
          name: "Certificate Identifier",
          description: "The user-supplied certificate identifier.",
          type: "string",
          required: false,
        },
        Filters: {
          name: "Filters",
          description: "This parameter isn't currently supported.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: {
                  type: "string",
                },
                Values: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              required: ["Name", "Values"],
              additionalProperties: false,
            },
          },
          required: false,
        },
        MaxRecords: {
          name: "Max Records",
          description:
            "The maximum number of records to include in the response.",
          type: "number",
          required: false,
        },
        Marker: {
          name: "Marker",
          description:
            "An optional pagination token provided by a previous DescribeCertificates request.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new RDSClient({
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

        const command = new DescribeCertificatesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Certificates Result",
      description: "Result from DescribeCertificates operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DefaultCertificateForNewLaunches: {
            type: "string",
            description:
              "The default root CA for new databases created by your Amazon Web Services account.",
          },
          Certificates: {
            type: "array",
            items: {
              type: "object",
              properties: {
                CertificateIdentifier: {
                  type: "string",
                },
                CertificateType: {
                  type: "string",
                },
                Thumbprint: {
                  type: "string",
                },
                ValidFrom: {
                  type: "string",
                },
                ValidTill: {
                  type: "string",
                },
                CertificateArn: {
                  type: "string",
                },
                CustomerOverride: {
                  type: "boolean",
                },
                CustomerOverrideValidTill: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "The list of Certificate objects for the Amazon Web Services account.",
          },
          Marker: {
            type: "string",
            description:
              "An optional pagination token provided by a previous DescribeCertificates request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeCertificates;
