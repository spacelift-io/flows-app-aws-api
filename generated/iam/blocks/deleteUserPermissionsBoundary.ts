import { AppBlock, events } from "@slflows/sdk/v1";
import {
  IAMClient,
  DeleteUserPermissionsBoundaryCommand,
} from "@aws-sdk/client-iam";

const deleteUserPermissionsBoundary: AppBlock = {
  name: "Delete User Permissions Boundary",
  description: "Deletes the permissions boundary for the specified IAM user.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        UserName: {
          name: "User Name",
          description:
            "The name (friendly name, not ARN) of the IAM user from which you want to remove the permissions boundary.",
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

        const command = new DeleteUserPermissionsBoundaryCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete User Permissions Boundary Result",
      description: "Result from DeleteUserPermissionsBoundary operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteUserPermissionsBoundary;
