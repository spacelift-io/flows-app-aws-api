import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DeleteVpcEndpointConnectionNotificationsCommand,
} from "@aws-sdk/client-ec2";

const deleteVpcEndpointConnectionNotifications: AppBlock = {
  name: "Delete Vpc Endpoint Connection Notifications",
  description: "Deletes the specified VPC endpoint connection notifications.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the action, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
        },
        ConnectionNotificationIds: {
          name: "Connection Notification Ids",
          description: "The IDs of the notifications.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new EC2Client({
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

        const command = new DeleteVpcEndpointConnectionNotificationsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Vpc Endpoint Connection Notifications Result",
      description:
        "Result from DeleteVpcEndpointConnectionNotifications operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Unsuccessful: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Error: {
                  type: "object",
                  properties: {
                    Code: {
                      type: "string",
                    },
                    Message: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                ResourceId: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "Information about the notifications that could not be deleted successfully.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteVpcEndpointConnectionNotifications;
