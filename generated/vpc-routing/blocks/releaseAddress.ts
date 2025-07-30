import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, ReleaseAddressCommand } from "@aws-sdk/client-ec2";

const releaseAddress: AppBlock = {
  name: "Release Address",
  description: "Releases the specified Elastic IP address.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        AllocationId: {
          name: "Allocation Id",
          description: "The allocation ID.",
          type: "string",
          required: false,
        },
        PublicIp: {
          name: "Public Ip",
          description: "Deprecated.",
          type: "string",
          required: false,
        },
        NetworkBorderGroup: {
          name: "Network Border Group",
          description:
            "The set of Availability Zones, Local Zones, or Wavelength Zones from which Amazon Web Services advertises IP addresses.",
          type: "string",
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

        const command = new ReleaseAddressCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Release Address Result",
      description: "Result from ReleaseAddress operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default releaseAddress;
