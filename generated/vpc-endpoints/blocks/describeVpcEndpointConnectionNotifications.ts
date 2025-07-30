import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeVpcEndpointConnectionNotificationsCommand,
} from "@aws-sdk/client-ec2";

const describeVpcEndpointConnectionNotifications: AppBlock = {
  name: "Describe Vpc Endpoint Connection Notifications",
  description:
    "Describes the connection notifications for VPC endpoints and VPC endpoint services.",
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
          required: false,
        },
        Filters: {
          name: "Filters",
          description: "The filters.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: {
                  type: "string",
                },
                Values: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              additionalProperties: false,
            },
          },
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of results to return in a single call.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token to request the next page of results.",
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

        const command = new DescribeVpcEndpointConnectionNotificationsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Vpc Endpoint Connection Notifications Result",
      description:
        "Result from DescribeVpcEndpointConnectionNotifications operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ConnectionNotificationSet: {
            type: "array",
            items: {
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
            },
            description: "The notifications.",
          },
          NextToken: {
            type: "string",
            description:
              "The token to use to retrieve the next page of results.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeVpcEndpointConnectionNotifications;
