import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RDSClient,
  RemoveRoleFromDBInstanceCommand,
} from "@aws-sdk/client-rds";

const removeRoleFromDBInstance: AppBlock = {
  name: "Remove Role From DB Instance",
  description:
    "Disassociates an Amazon Web Services Identity and Access Management (IAM) role from a DB instance.",
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
            "The name of the DB instance to disassociate the IAM role from.",
          type: "string",
          required: true,
        },
        RoleArn: {
          name: "Role Arn",
          description:
            "The Amazon Resource Name (ARN) of the IAM role to disassociate from the DB instance, for example, arn:aws:iam::123456789012:role/AccessRole.",
          type: "string",
          required: true,
        },
        FeatureName: {
          name: "Feature Name",
          description:
            "The name of the feature for the DB instance that the IAM role is to be disassociated from.",
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

        const command = new RemoveRoleFromDBInstanceCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Remove Role From DB Instance Result",
      description: "Result from RemoveRoleFromDBInstance operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default removeRoleFromDBInstance;
