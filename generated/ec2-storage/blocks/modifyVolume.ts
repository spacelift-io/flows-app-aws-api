import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, ModifyVolumeCommand } from "@aws-sdk/client-ec2";

const modifyVolume: AppBlock = {
  name: "Modify Volume",
  description:
    "You can modify several parameters of an existing EBS volume, including volume size, volume type, and IOPS capacity.",
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
        VolumeId: {
          name: "Volume Id",
          description: "The ID of the volume.",
          type: "string",
          required: true,
        },
        Size: {
          name: "Size",
          description: "The target size of the volume, in GiB.",
          type: "number",
          required: false,
        },
        VolumeType: {
          name: "Volume Type",
          description: "The target EBS volume type of the volume.",
          type: "string",
          required: false,
        },
        Iops: {
          name: "Iops",
          description: "The target IOPS rate of the volume.",
          type: "number",
          required: false,
        },
        Throughput: {
          name: "Throughput",
          description: "The target throughput of the volume, in MiB/s.",
          type: "number",
          required: false,
        },
        MultiAttachEnabled: {
          name: "Multi Attach Enabled",
          description: "Specifies whether to enable Amazon EBS Multi-Attach.",
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

        const command = new ModifyVolumeCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Volume Result",
      description: "Result from ModifyVolume operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          VolumeModification: {
            type: "object",
            properties: {
              VolumeId: {
                type: "string",
              },
              ModificationState: {
                type: "string",
              },
              StatusMessage: {
                type: "string",
              },
              TargetSize: {
                type: "number",
              },
              TargetIops: {
                type: "number",
              },
              TargetVolumeType: {
                type: "string",
              },
              TargetThroughput: {
                type: "number",
              },
              TargetMultiAttachEnabled: {
                type: "boolean",
              },
              OriginalSize: {
                type: "number",
              },
              OriginalIops: {
                type: "number",
              },
              OriginalVolumeType: {
                type: "string",
              },
              OriginalThroughput: {
                type: "number",
              },
              OriginalMultiAttachEnabled: {
                type: "boolean",
              },
              Progress: {
                type: "number",
              },
              StartTime: {
                type: "string",
              },
              EndTime: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "Information about the volume modification.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default modifyVolume;
