import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  ModifyVpcEndpointConnectionNotificationCommand,
} from "@aws-sdk/client-ec2";

const modifyVpcEndpointConnectionNotification: AppBlock = {
  name: "Modify Vpc Endpoint Connection Notification",
  description:
    "Modifies a connection notification for VPC endpoint or VPC endpoint service.",
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
        ConnectionNotificationId: {
          name: "Connection Notification Id",
          description: "The ID of the notification.",
          type: "string",
          required: true,
        },
        ConnectionNotificationArn: {
          name: "Connection Notification Arn",
          description: "The ARN for the SNS topic for the notification.",
          type: "string",
          required: false,
        },
        ConnectionEvents: {
          name: "Connection Events",
          description: "The events for the endpoint.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
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
        });

        const command = new ModifyVpcEndpointConnectionNotificationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Vpc Endpoint Connection Notification Result",
      description:
        "Result from ModifyVpcEndpointConnectionNotification operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ReturnValue: {
            type: "boolean",
            description:
              "Returns true if the request succeeds; otherwise, it returns an error.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default modifyVpcEndpointConnectionNotification;
