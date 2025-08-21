import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EventBridgeClient,
  RemovePermissionCommand,
} from "@aws-sdk/client-eventbridge";

const removePermission: AppBlock = {
  name: "Remove Permission",
  description:
    "Revokes the permission of another Amazon Web Services account to be able to put events to the specified event bus.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        StatementId: {
          name: "Statement Id",
          description:
            "The statement ID corresponding to the account that is no longer allowed to put events to the default event bus.",
          type: "string",
          required: false,
        },
        RemoveAllPermissions: {
          name: "Remove All Permissions",
          description: "Specifies whether to remove all permissions.",
          type: "boolean",
          required: false,
        },
        EventBusName: {
          name: "Event Bus Name",
          description: "The name of the event bus to revoke permissions for.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new EventBridgeClient({
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

        const command = new RemovePermissionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Remove Permission Result",
      description: "Result from RemovePermission operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default removePermission;
