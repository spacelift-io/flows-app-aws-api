import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, ModifyActivityStreamCommand } from "@aws-sdk/client-rds";

const modifyActivityStream: AppBlock = {
  name: "Modify Activity Stream",
  description:
    "Changes the audit policy state of a database activity stream to either locked (default) or unlocked.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ResourceArn: {
          name: "Resource Arn",
          description:
            "The Amazon Resource Name (ARN) of the RDS for Oracle or Microsoft SQL Server DB instance.",
          type: "string",
          required: false,
        },
        AuditPolicyState: {
          name: "Audit Policy State",
          description: "The audit policy state.",
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

        const command = new ModifyActivityStreamCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Activity Stream Result",
      description: "Result from ModifyActivityStream operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          KmsKeyId: {
            type: "string",
            description:
              "The Amazon Web Services KMS key identifier for encryption of messages in the database activity stream.",
          },
          KinesisStreamName: {
            type: "string",
            description:
              "The name of the Amazon Kinesis data stream to be used for the database activity stream.",
          },
          Status: {
            type: "string",
            description:
              "The status of the modification to the database activity stream.",
          },
          Mode: {
            type: "string",
            description: "The mode of the database activity stream.",
          },
          EngineNativeAuditFieldsIncluded: {
            type: "boolean",
            description:
              "Indicates whether engine-native audit fields are included in the database activity stream.",
          },
          PolicyStatus: {
            type: "string",
            description:
              "The status of the modification to the policy state of the database activity stream.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default modifyActivityStream;
