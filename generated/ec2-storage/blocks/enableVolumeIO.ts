import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, EnableVolumeIOCommand } from "@aws-sdk/client-ec2";

const enableVolumeIO: AppBlock = {
  name: "Enable Volume IO",
  description:
    "Enables I/O operations for a volume that had I/O operations disabled because the data on the volume was potentially inconsistent.",
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

        const command = new EnableVolumeIOCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Enable Volume IO Result",
      description: "Result from EnableVolumeIO operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default enableVolumeIO;
