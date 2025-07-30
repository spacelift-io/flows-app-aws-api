import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, AssociateAddressCommand } from "@aws-sdk/client-ec2";

const associateAddress: AppBlock = {
  name: "Associate Address",
  description:
    "Associates an Elastic IP address, or carrier IP address (for instances that are in subnets in Wavelength Zones) with an instance or a network interface.",
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
        InstanceId: {
          name: "Instance Id",
          description: "The ID of the instance.",
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
        NetworkInterfaceId: {
          name: "Network Interface Id",
          description: "The ID of the network interface.",
          type: "string",
          required: false,
        },
        PrivateIpAddress: {
          name: "Private Ip Address",
          description:
            "The primary or secondary private IP address to associate with the Elastic IP address.",
          type: "string",
          required: false,
        },
        AllowReassociation: {
          name: "Allow Reassociation",
          description:
            "Reassociation is automatic, but you can specify false to ensure the operation fails if the Elastic IP address is already associated with another resource.",
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

        const command = new AssociateAddressCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Associate Address Result",
      description: "Result from AssociateAddress operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          AssociationId: {
            type: "string",
            description:
              "The ID that represents the association of the Elastic IP address with an instance.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default associateAddress;
