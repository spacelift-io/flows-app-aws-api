import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  DeleteClusterSubnetGroupCommand,
} from "@aws-sdk/client-redshift";

const deleteClusterSubnetGroup: AppBlock = {
  name: "Delete Cluster Subnet Group",
  description: `Deletes the specified cluster subnet group.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ClusterSubnetGroupName: {
          name: "Cluster Subnet Group Name",
          description:
            "The name of the cluster subnet group name to be deleted.",
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

        const command = new DeleteClusterSubnetGroupCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Cluster Subnet Group Result",
      description: "Result from DeleteClusterSubnetGroup operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteClusterSubnetGroup;
