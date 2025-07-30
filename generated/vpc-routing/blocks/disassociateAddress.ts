import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, DisassociateAddressCommand } from "@aws-sdk/client-ec2";

const disassociateAddress: AppBlock = {
  name: "Disassociate Address",
  description:
    "Disassociates an Elastic IP address from the instance or network interface it's associated with.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        AssociationId: {
          name: "Association Id",
          description: "The association ID.",
          type: "string",
          required: false,
        },
        PublicIp: {
          name: "Public Ip",
          description: "Deprecated.",
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

        const command = new DisassociateAddressCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Disassociate Address Result",
      description: "Result from DisassociateAddress operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default disassociateAddress;
