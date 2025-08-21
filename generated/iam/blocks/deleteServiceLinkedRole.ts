import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, DeleteServiceLinkedRoleCommand } from "@aws-sdk/client-iam";

const deleteServiceLinkedRole: AppBlock = {
  name: "Delete Service Linked Role",
  description:
    "Submits a service-linked role deletion request and returns a DeletionTaskId, which you can use to check the status of the deletion.",
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
          description: "The name of the service-linked role to be deleted.",
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

        const command = new DeleteServiceLinkedRoleCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Service Linked Role Result",
      description: "Result from DeleteServiceLinkedRole operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DeletionTaskId: {
            type: "string",
            description:
              "The deletion task identifier that you can use to check the status of the deletion.",
          },
        },
        required: ["DeletionTaskId"],
      },
    },
  },
};

export default deleteServiceLinkedRole;
