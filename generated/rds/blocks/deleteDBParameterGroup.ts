import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, DeleteDBParameterGroupCommand } from "@aws-sdk/client-rds";

const deleteDBParameterGroup: AppBlock = {
  name: "Delete DB Parameter Group",
  description: "Deletes a specified DB parameter group.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DBParameterGroupName: {
          name: "DB Parameter Group Name",
          description: "The name of the DB parameter group.",
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

        const command = new DeleteDBParameterGroupCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete DB Parameter Group Result",
      description: "Result from DeleteDBParameterGroup operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteDBParameterGroup;
