import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, AttachNetworkInterfaceCommand } from "@aws-sdk/client-ec2";

const attachNetworkInterface: AppBlock = {
  name: "Attach Network Interface",
  description: "Attaches a network interface to an instance.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        NetworkCardIndex: {
          name: "Network Card Index",
          description: "The index of the network card.",
          type: "number",
          required: false,
        },
        EnaSrdSpecification: {
          name: "Ena Srd Specification",
          description:
            "Configures ENA Express for the network interface that this action attaches to the instance.",
          type: {
            type: "object",
            properties: {
              EnaSrdEnabled: {
                type: "boolean",
              },
              EnaSrdUdpSpecification: {
                type: "object",
                properties: {
                  EnaSrdUdpEnabled: {
                    type: "boolean",
                  },
                },
                additionalProperties: false,
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        EnaQueueCount: {
          name: "Ena Queue Count",
          description:
            "The number of ENA queues to be created with the instance.",
          type: "number",
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
          required: true,
        },
        InstanceId: {
          name: "Instance Id",
          description: "The ID of the instance.",
          type: "string",
          required: true,
        },
        DeviceIndex: {
          name: "Device Index",
          description:
            "The index of the device for the network interface attachment.",
          type: "number",
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

        const command = new AttachNetworkInterfaceCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Attach Network Interface Result",
      description: "Result from AttachNetworkInterface operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          AttachmentId: {
            type: "string",
            description: "The ID of the network interface attachment.",
          },
          NetworkCardIndex: {
            type: "number",
            description: "The index of the network card.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default attachNetworkInterface;
