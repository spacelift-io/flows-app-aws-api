import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, DeregisterImageCommand } from "@aws-sdk/client-ec2";

const deregisterImage: AppBlock = {
  name: "Deregister Image",
  description: "Deregisters the specified AMI.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ImageId: {
          name: "Image Id",
          description: "The ID of the AMI.",
          type: "string",
          required: true,
        },
        DeleteAssociatedSnapshots: {
          name: "Delete Associated Snapshots",
          description:
            "Specifies whether to delete the snapshots associated with the AMI during deregistration.",
          type: "boolean",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new DeregisterImageCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Deregister Image Result",
      description: "Result from DeregisterImage operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Return: {
            type: "boolean",
            description:
              "Returns true if the request succeeds; otherwise, it returns an error.",
          },
          DeleteSnapshotResults: {
            type: "array",
            items: {
              type: "object",
              properties: {
                SnapshotId: {
                  type: "string",
                },
                ReturnCode: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "The deletion result for each snapshot associated with the AMI, including the snapshot ID and its success or error code.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deregisterImage;
