import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, AddRoleToDBInstanceCommand } from "@aws-sdk/client-rds";

const addRoleToDBInstance: AppBlock = {
  name: "Add Role To DB Instance",
  description:
    "Associates an Amazon Web Services Identity and Access Management (IAM) role with a DB instance.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DBInstanceIdentifier: {
          name: "DB Instance Identifier",
          description:
            "The name of the DB instance to associate the IAM role with.",
          type: "string",
          required: true,
        },
        RoleArn: {
          name: "Role Arn",
          description:
            "The Amazon Resource Name (ARN) of the IAM role to associate with the DB instance, for example arn:aws:iam::123456789012:role/AccessRole.",
          type: "string",
          required: true,
        },
        FeatureName: {
          name: "Feature Name",
          description:
            "The name of the feature for the DB instance that the IAM role is to be associated with.",
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

        const command = new AddRoleToDBInstanceCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Add Role To DB Instance Result",
      description: "Result from AddRoleToDBInstance operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default addRoleToDBInstance;
