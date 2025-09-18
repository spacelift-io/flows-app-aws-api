import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  ModifyIntegrationCommand,
} from "@aws-sdk/client-redshift";

const modifyIntegration: AppBlock = {
  name: "Modify Integration",
  description: `Modifies a zero-ETL integration or S3 event integration with Amazon Redshift.`,
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
          description: "The unique identifier of the integration to modify.",
          type: "string",
          required: true,
        },
        Description: {
          name: "Description",
          description: "A new description for the integration.",
          type: "string",
          required: false,
        },
        IntegrationName: {
          name: "Integration Name",
          description: "A new name for the integration.",
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

        const command = new ModifyIntegrationCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Integration Result",
      description: "Result from ModifyIntegration operation",
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

export default modifyIntegration;
