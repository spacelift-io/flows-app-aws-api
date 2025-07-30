import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, DeleteDBSecurityGroupCommand } from "@aws-sdk/client-rds";

const deleteDBSecurityGroup: AppBlock = {
  name: "Delete DB Security Group",
  description: "Deletes a DB security group.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DBSecurityGroupName: {
          name: "DB Security Group Name",
          description: "The name of the DB security group to delete.",
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

        const command = new DeleteDBSecurityGroupCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete DB Security Group Result",
      description: "Result from DeleteDBSecurityGroup operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteDBSecurityGroup;
