import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, AddRoleToDBClusterCommand } from "@aws-sdk/client-rds";

const addRoleToDBCluster: AppBlock = {
  name: "Add Role To DB Cluster",
  description:
    "Associates an Identity and Access Management (IAM) role with a DB cluster.",
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
            "The name of the DB cluster to associate the IAM role with.",
          type: "string",
          required: true,
        },
        RoleArn: {
          name: "Role Arn",
          description:
            "The Amazon Resource Name (ARN) of the IAM role to associate with the Aurora DB cluster, for example arn:aws:iam::123456789012:role/AuroraAccessRole.",
          type: "string",
          required: true,
        },
        FeatureName: {
          name: "Feature Name",
          description:
            "The name of the feature for the DB cluster that the IAM role is to be associated with.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new AddRoleToDBClusterCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Add Role To DB Cluster Result",
      description: "Result from AddRoleToDBCluster operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default addRoleToDBCluster;
