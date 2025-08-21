import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, DeleteOpsMetadataCommand } from "@aws-sdk/client-ssm";

const deleteOpsMetadata: AppBlock = {
  name: "Delete Ops Metadata",
  description: "Delete OpsMetadata related to an application.",
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
            "The Amazon Resource Name (ARN) of an OpsMetadata Object to delete.",
          type: "string",
          required: true,
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new DeleteOpsMetadataCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Ops Metadata Result",
      description: "Result from DeleteOpsMetadata operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default deleteOpsMetadata;
