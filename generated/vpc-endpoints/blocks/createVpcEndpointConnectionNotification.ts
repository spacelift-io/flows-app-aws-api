import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  CreateVpcEndpointConnectionNotificationCommand,
} from "@aws-sdk/client-ec2";

const createVpcEndpointConnectionNotification: AppBlock = {
  name: "Create Vpc Endpoint Connection Notification",
  description:
    "Creates a connection notification for a specified VPC endpoint or VPC endpoint service.",
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
        ServiceId: {
          name: "Service Id",
          description: "The ID of the endpoint service.",
          type: "string",
          required: false,
        },
        VpcEndpointId: {
          name: "Vpc Endpoint Id",
          description: "The ID of the endpoint.",
          type: "string",
          required: false,
        },
        ConnectionNotificationArn: {
          name: "Connection Notification Arn",
          description: "The ARN of the SNS topic for the notifications.",
          type: "string",
          required: true,
        },
        ConnectionEvents: {
          name: "Connection Events",
          description:
            "The endpoint events for which to receive notifications.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: true,
        },
        ClientToken: {
          name: "Client Token",
          description:
            "Unique, case-sensitive identifier that you provide to ensure the idempotency of the request.",
          type: "string",
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

        const command = new CreateVpcEndpointConnectionNotificationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Vpc Endpoint Connection Notification Result",
      description:
        "Result from CreateVpcEndpointConnectionNotification operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ConnectionNotification: {
            type: "object",
            properties: {
              ConnectionNotificationId: {
                type: "string",
              },
              ServiceId: {
                type: "string",
              },
              VpcEndpointId: {
                type: "string",
              },
              ConnectionNotificationType: {
                type: "string",
              },
              ConnectionNotificationArn: {
                type: "string",
              },
              ConnectionEvents: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              ConnectionNotificationState: {
                type: "string",
              },
              ServiceRegion: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "Information about the notification.",
          },
          ClientToken: {
            type: "string",
            description:
              "Unique, case-sensitive identifier that you provide to ensure the idempotency of the request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createVpcEndpointConnectionNotification;
