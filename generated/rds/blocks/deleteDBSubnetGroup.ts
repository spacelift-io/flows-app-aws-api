import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, DeleteDBSubnetGroupCommand } from "@aws-sdk/client-rds";

const deleteDBSubnetGroup: AppBlock = {
  name: "Delete DB Subnet Group",
  description: "Deletes a DB subnet group.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DBSubnetGroupName: {
          name: "DB Subnet Group Name",
          description: "The name of the database subnet group to delete.",
          type: "string",
          required: true,
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
        });

        const command = new DeleteDBSubnetGroupCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete DB Subnet Group Result",
      description: "Result from DeleteDBSubnetGroup operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteDBSubnetGroup;
