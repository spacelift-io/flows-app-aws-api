import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  DescribeStorageCommand,
} from "@aws-sdk/client-redshift";

const describeStorage: AppBlock = {
  name: "Describe Storage",
  description: `Returns account level backups storage size and provisional storage.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
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

        const command = new DescribeStorageCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Storage Result",
      description: "Result from DescribeStorage operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TotalBackupSizeInMegaBytes: {
            type: "number",
            description:
              "The total amount of storage currently used for snapshots.",
          },
          TotalProvisionedStorageInMegaBytes: {
            type: "number",
            description: "The total amount of storage currently provisioned.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeStorage;
