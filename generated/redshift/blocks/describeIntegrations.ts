import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  DescribeIntegrationsCommand,
} from "@aws-sdk/client-redshift";

const describeIntegrations: AppBlock = {
  name: "Describe Integrations",
  description: `Describes one or more zero-ETL or S3 event integrations with Amazon Redshift.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        IntegrationArn: {
          name: "Integration Arn",
          description: "The unique identifier of the integration.",
          type: "string",
          required: false,
        },
        MaxRecords: {
          name: "Max Records",
          description:
            "The maximum number of response records to return in each call.",
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
              "A value that indicates the starting point for the next set of response records in a subsequent request.",
          },
          Integrations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                IntegrationArn: {
                  type: "string",
                },
                IntegrationName: {
                  type: "string",
                },
                SourceArn: {
                  type: "string",
                },
                TargetArn: {
                  type: "string",
                },
                Status: {
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
                CreateTime: {
                  type: "string",
                },
                Description: {
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
              },
              additionalProperties: false,
            },
            description: "List of integrations that are described.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeIntegrations;
