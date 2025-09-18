import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  DeleteClusterParameterGroupCommand,
} from "@aws-sdk/client-redshift";

const deleteClusterParameterGroup: AppBlock = {
  name: "Delete Cluster Parameter Group",
  description: `Deletes a specified Amazon Redshift parameter group.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ParameterGroupName: {
          name: "Parameter Group Name",
          description: "The name of the parameter group to be deleted.",
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

        const command = new DeleteClusterParameterGroupCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Cluster Parameter Group Result",
      description: "Result from DeleteClusterParameterGroup operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteClusterParameterGroup;
