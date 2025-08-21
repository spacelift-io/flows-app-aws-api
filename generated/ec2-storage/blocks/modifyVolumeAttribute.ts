import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, ModifyVolumeAttributeCommand } from "@aws-sdk/client-ec2";

const modifyVolumeAttribute: AppBlock = {
  name: "Modify Volume Attribute",
  description: "Modifies a volume attribute.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        AutoEnableIO: {
          name: "Auto Enable IO",
          description:
            "Indicates whether the volume should be auto-enabled for I/O operations.",
          type: {
            type: "object",
            properties: {
              Value: {
                type: "boolean",
              },
            },
            additionalProperties: false,
          },
          required: false,
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new ModifyVolumeAttributeCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Volume Attribute Result",
      description: "Result from ModifyVolumeAttribute operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default modifyVolumeAttribute;
