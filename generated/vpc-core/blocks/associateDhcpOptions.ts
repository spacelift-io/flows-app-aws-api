import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, AssociateDhcpOptionsCommand } from "@aws-sdk/client-ec2";

const associateDhcpOptions: AppBlock = {
  name: "Associate Dhcp Options",
  description:
    "Associates a set of DHCP options (that you've previously created) with the specified VPC, or associates no DHCP options with the VPC.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DhcpOptionsId: {
          name: "Dhcp Options Id",
          description:
            "The ID of the DHCP options set, or default to associate no DHCP options with the VPC.",
          type: "string",
          required: true,
        },
        VpcId: {
          name: "Vpc Id",
          description: "The ID of the VPC.",
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

        const command = new AssociateDhcpOptionsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Associate Dhcp Options Result",
      description: "Result from AssociateDhcpOptions operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default associateDhcpOptions;
