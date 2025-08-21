import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DeregisterInstanceEventNotificationAttributesCommand,
} from "@aws-sdk/client-ec2";

const deregisterInstanceEventNotificationAttributes: AppBlock = {
  name: "Deregister Instance Event Notification Attributes",
  description:
    "Deregisters tag keys to prevent tags that have the specified tag keys from being included in scheduled event notifications for resources in the Region.",
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
        InstanceTagAttribute: {
          name: "Instance Tag Attribute",
          description: "Information about the tag keys to deregister.",
          type: {
            type: "object",
            properties: {
              IncludeAllTagsOfInstance: {
                type: "boolean",
              },
              InstanceTagKeys: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },
            additionalProperties: false,
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

        const command =
          new DeregisterInstanceEventNotificationAttributesCommand(
            commandInput as any,
          );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Deregister Instance Event Notification Attributes Result",
      description:
        "Result from DeregisterInstanceEventNotificationAttributes operation",
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
            description: "The resulting set of tag keys.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deregisterInstanceEventNotificationAttributes;
