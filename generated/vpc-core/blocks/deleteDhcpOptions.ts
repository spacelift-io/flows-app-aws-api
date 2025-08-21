import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, DeleteDhcpOptionsCommand } from "@aws-sdk/client-ec2";

const deleteDhcpOptions: AppBlock = {
  name: "Delete Dhcp Options",
  description: "Deletes the specified set of DHCP options.",
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
          description: "The ID of the DHCP options set.",
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

        const command = new DeleteDhcpOptionsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Dhcp Options Result",
      description: "Result from DeleteDhcpOptions operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteDhcpOptions;
