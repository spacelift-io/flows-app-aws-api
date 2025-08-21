import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, DescribeIntegrationsCommand } from "@aws-sdk/client-rds";

const describeIntegrations: AppBlock = {
  name: "Describe Integrations",
  description:
    "Describe one or more zero-ETL integrations with Amazon Redshift.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        IntegrationIdentifier: {
          name: "Integration Identifier",
          description: "The unique identifier of the integration.",
          type: "string",
          required: false,
        },
        Filters: {
          name: "Filters",
          description:
            "A filter that specifies one or more resources to return.",
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
            "An optional pagination token provided by a previous DescribeIntegrations request.",
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

        const command = new DescribeIntegrationsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Integrations Result",
      description: "Result from DescribeIntegrations operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Marker: {
            type: "string",
            description:
              "A pagination token that can be used in a later DescribeIntegrations request.",
          },
          Integrations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                SourceArn: {
                  type: "string",
                },
                TargetArn: {
                  type: "string",
                },
                IntegrationName: {
                  type: "string",
                },
                IntegrationArn: {
                  type: "string",
                },
                KMSKeyId: {
                  type: "string",
                },
                AdditionalEncryptionContext: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                },
                Status: {
                  type: "string",
                },
                Tags: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Key: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Value: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                CreateTime: {
                  type: "string",
                },
                Errors: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      ErrorCode: {
                        type: "object",
                        additionalProperties: true,
                      },
                      ErrorMessage: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    required: ["ErrorCode"],
                    additionalProperties: false,
                  },
                },
                DataFilter: {
                  type: "string",
                },
                Description: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "A list of integrations.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeIntegrations;
