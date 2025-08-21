import { AppBlock, events } from "@slflows/sdk/v1";
import {
  IAMClient,
  DeleteRolePermissionsBoundaryCommand,
} from "@aws-sdk/client-iam";

const deleteRolePermissionsBoundary: AppBlock = {
  name: "Delete Role Permissions Boundary",
  description: "Deletes the permissions boundary for the specified IAM role.",
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
            "The name (friendly name, not ARN) of the IAM role from which you want to remove the permissions boundary.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new DeleteRolePermissionsBoundaryCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Role Permissions Boundary Result",
      description: "Result from DeleteRolePermissionsBoundary operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteRolePermissionsBoundary;
