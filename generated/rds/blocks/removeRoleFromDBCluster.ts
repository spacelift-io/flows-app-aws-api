import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, RemoveRoleFromDBClusterCommand } from "@aws-sdk/client-rds";

const removeRoleFromDBCluster: AppBlock = {
  name: "Remove Role From DB Cluster",
  description:
    "Removes the asssociation of an Amazon Web Services Identity and Access Management (IAM) role from a DB cluster.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DBClusterIdentifier: {
          name: "DB Cluster Identifier",
          description:
            "The name of the DB cluster to disassociate the IAM role from.",
          type: "string",
          required: true,
        },
        RoleArn: {
          name: "Role Arn",
          description:
            "The Amazon Resource Name (ARN) of the IAM role to disassociate from the Aurora DB cluster, for example arn:aws:iam::123456789012:role/AuroraAccessRole.",
          type: "string",
          required: true,
        },
        FeatureName: {
          name: "Feature Name",
          description:
            "The name of the feature for the DB cluster that the IAM role is to be disassociated from.",
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
        });

        const command = new RemoveRoleFromDBClusterCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Remove Role From DB Cluster Result",
      description: "Result from RemoveRoleFromDBCluster operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default removeRoleFromDBCluster;
