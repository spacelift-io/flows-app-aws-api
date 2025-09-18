import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  CreateIntegrationCommand,
} from "@aws-sdk/client-redshift";

const createIntegration: AppBlock = {
  name: "Create Integration",
  description: `Creates a zero-ETL integration or S3 event integration with Amazon Redshift.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        SourceArn: {
          name: "Source Arn",
          description:
            "The Amazon Resource Name (ARN) of the database to use as the source for replication.",
          type: "string",
          required: true,
        },
        TargetArn: {
          name: "Target Arn",
          description:
            "The Amazon Resource Name (ARN) of the Amazon Redshift data warehouse to use as the target for replication.",
          type: "string",
          required: true,
        },
        IntegrationName: {
          name: "Integration Name",
          description: "The name of the integration.",
          type: "string",
          required: true,
        },
        KMSKeyId: {
          name: "KMS Key Id",
          description:
            "An Key Management Service (KMS) key identifier for the key to use to encrypt the integration.",
          type: "string",
          required: false,
        },
        TagList: {
          name: "Tag List",
          description: "A list of tags.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Key: {
                  type: "string",
                },
                Value: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
          },
          required: false,
        },
        AdditionalEncryptionContext: {
          name: "Additional Encryption Context",
          description:
            "An optional set of non-secret key–value pairs that contains additional contextual information about the data.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
          },
          required: false,
        },
        Description: {
          name: "Description",
          description: "A description of the integration.",
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

        const command = new CreateIntegrationCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Integration Result",
      description: "Result from CreateIntegration operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          IntegrationArn: {
            type: "string",
            description: "The Amazon Resource Name (ARN) of the integration.",
          },
          IntegrationName: {
            type: "string",
            description: "The name of the integration.",
          },
          SourceArn: {
            type: "string",
            description:
              "The Amazon Resource Name (ARN) of the database used as the source for replication.",
          },
          TargetArn: {
            type: "string",
            description:
              "The Amazon Resource Name (ARN) of the Amazon Redshift data warehouse to use as the target for replication.",
          },
          Status: {
            type: "string",
            description: "The current status of the integration.",
          },
          Errors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ErrorCode: {
                  type: "string",
                },
                ErrorMessage: {
                  type: "string",
                },
              },
              required: ["ErrorCode"],
              additionalProperties: false,
            },
            description: "Any errors associated with the integration.",
          },
          CreateTime: {
            type: "string",
            description: "The time (UTC) when the integration was created.",
          },
          Description: {
            type: "string",
            description: "The description of the integration.",
          },
          KMSKeyId: {
            type: "string",
            description:
              "The Key Management Service (KMS) key identifier for the key used to encrypt the integration.",
          },
          AdditionalEncryptionContext: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description: "The encryption context for the integration.",
          },
          Tags: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Key: {
                  type: "string",
                },
                Value: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "The list of tags associated with the integration.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createIntegration;
