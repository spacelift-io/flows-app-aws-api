import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, UpdateOpsMetadataCommand } from "@aws-sdk/client-ssm";

const updateOpsMetadata: AppBlock = {
  name: "Update Ops Metadata",
  description:
    "Amazon Web Services Systems Manager calls this API operation when you edit OpsMetadata in Application Manager.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        OpsMetadataArn: {
          name: "Ops Metadata Arn",
          description:
            "The Amazon Resource Name (ARN) of the OpsMetadata Object to update.",
          type: "string",
          required: true,
        },
        MetadataToUpdate: {
          name: "Metadata To Update",
          description: "Metadata to add to an OpsMetadata object.",
          type: {
            type: "object",
            additionalProperties: {
              type: "object",
            },
          },
          required: false,
        },
        KeysToDelete: {
          name: "Keys To Delete",
          description:
            "The metadata keys to delete from the OpsMetadata object.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new SSMClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new UpdateOpsMetadataCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Ops Metadata Result",
      description: "Result from UpdateOpsMetadata operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          OpsMetadataArn: {
            type: "string",
            description:
              "The Amazon Resource Name (ARN) of the OpsMetadata Object that was updated.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateOpsMetadata;
