import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeSnapshotAttributeCommand,
} from "@aws-sdk/client-ec2";

const describeSnapshotAttribute: AppBlock = {
  name: "Describe Snapshot Attribute",
  description: "Describes the specified attribute of the specified snapshot.",
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
          description: "The snapshot attribute you would like to view.",
          type: "string",
          required: true,
        },
        SnapshotId: {
          name: "Snapshot Id",
          description: "The ID of the EBS snapshot.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new DescribeSnapshotAttributeCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Snapshot Attribute Result",
      description: "Result from DescribeSnapshotAttribute operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ProductCodes: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ProductCodeId: {
                  type: "string",
                },
                ProductCodeType: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "The product codes.",
          },
          SnapshotId: {
            type: "string",
            description: "The ID of the EBS snapshot.",
          },
          CreateVolumePermissions: {
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
            description:
              "The users and groups that have the permissions for creating volumes from the snapshot.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeSnapshotAttribute;
