import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, DescribeVolumeAttributeCommand } from "@aws-sdk/client-ec2";

const describeVolumeAttribute: AppBlock = {
  name: "Describe Volume Attribute",
  description: "Describes the specified attribute of the specified volume.",
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
          description: "The attribute of the volume.",
          type: "string",
          required: true,
        },
        VolumeId: {
          name: "Volume Id",
          description: "The ID of the volume.",
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

        const command = new DescribeVolumeAttributeCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Volume Attribute Result",
      description: "Result from DescribeVolumeAttribute operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          AutoEnableIO: {
            type: "object",
            properties: {
              Value: {
                type: "boolean",
              },
            },
            additionalProperties: false,
            description: "The state of autoEnableIO attribute.",
          },
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
            description: "A list of product codes.",
          },
          VolumeId: {
            type: "string",
            description: "The ID of the volume.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeVolumeAttribute;
