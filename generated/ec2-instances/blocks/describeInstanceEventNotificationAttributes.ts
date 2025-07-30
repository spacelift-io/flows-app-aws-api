import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeInstanceEventNotificationAttributesCommand,
} from "@aws-sdk/client-ec2";

const describeInstanceEventNotificationAttributes: AppBlock = {
  name: "Describe Instance Event Notification Attributes",
  description:
    "Describes the tag keys that are registered to appear in scheduled event notifications for resources in the current Region.",
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

        const command = new DescribeInstanceEventNotificationAttributesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Instance Event Notification Attributes Result",
      description:
        "Result from DescribeInstanceEventNotificationAttributes operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          InstanceTagAttribute: {
            type: "object",
            properties: {
              InstanceTagKeys: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              IncludeAllTagsOfInstance: {
                type: "boolean",
              },
            },
            additionalProperties: false,
            description: "Information about the registered tag keys.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeInstanceEventNotificationAttributes;
