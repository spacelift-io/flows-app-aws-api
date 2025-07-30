import { AppBlock, events } from "@slflows/sdk/v1";
import {
  IAMClient,
  PutRolePermissionsBoundaryCommand,
} from "@aws-sdk/client-iam";

const putRolePermissionsBoundary: AppBlock = {
  name: "Put Role Permissions Boundary",
  description:
    "Adds or updates the policy that is specified as the IAM role's permissions boundary.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        RoleName: {
          name: "Role Name",
          description:
            "The name (friendly name, not ARN) of the IAM role for which you want to set the permissions boundary.",
          type: "string",
          required: true,
        },
        PermissionsBoundary: {
          name: "Permissions Boundary",
          description:
            "The ARN of the managed policy that is used to set the permissions boundary for the role.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new IAMClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new PutRolePermissionsBoundaryCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Role Permissions Boundary Result",
      description: "Result from PutRolePermissionsBoundary operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default putRolePermissionsBoundary;
