import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RDSClient,
  DeleteDBClusterParameterGroupCommand,
} from "@aws-sdk/client-rds";

const deleteDBClusterParameterGroup: AppBlock = {
  name: "Delete DB Cluster Parameter Group",
  description: "Deletes a specified DB cluster parameter group.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DBClusterParameterGroupName: {
          name: "DB Cluster Parameter Group Name",
          description: "The name of the DB cluster parameter group.",
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

        const command = new DeleteDBClusterParameterGroupCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete DB Cluster Parameter Group Result",
      description: "Result from DeleteDBClusterParameterGroup operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteDBClusterParameterGroup;
