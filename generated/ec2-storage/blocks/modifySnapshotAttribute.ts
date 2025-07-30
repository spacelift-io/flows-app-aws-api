import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, ModifySnapshotAttributeCommand } from "@aws-sdk/client-ec2";

const modifySnapshotAttribute: AppBlock = {
  name: "Modify Snapshot Attribute",
  description:
    "Adds or removes permission settings for the specified snapshot.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Attribute: {
          name: "Attribute",
          description: "The snapshot attribute to modify.",
          type: "string",
          required: false,
        },
        CreateVolumePermission: {
          name: "Create Volume Permission",
          description:
            "A JSON representation of the snapshot attribute modification.",
          type: {
            type: "object",
            properties: {
              Add: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    UserId: {
                      type: "string",
                    },
                    Group: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              Remove: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    UserId: {
                      type: "string",
                    },
                    Group: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        GroupNames: {
          name: "Group Names",
          description: "The group to modify for the snapshot.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        OperationType: {
          name: "Operation Type",
          description: "The type of operation to perform to the attribute.",
          type: "string",
          required: false,
        },
        SnapshotId: {
          name: "Snapshot Id",
          description: "The ID of the snapshot.",
          type: "string",
          required: true,
        },
        UserIds: {
          name: "User Ids",
          description: "The account ID to modify for the snapshot.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
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

        const command = new ModifySnapshotAttributeCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Snapshot Attribute Result",
      description: "Result from ModifySnapshotAttribute operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default modifySnapshotAttribute;
