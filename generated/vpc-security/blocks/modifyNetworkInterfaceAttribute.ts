import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  ModifyNetworkInterfaceAttributeCommand,
} from "@aws-sdk/client-ec2";

const modifyNetworkInterfaceAttribute: AppBlock = {
  name: "Modify Network Interface Attribute",
  description: "Modifies the specified network interface attribute.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        EnaSrdSpecification: {
          name: "Ena Srd Specification",
          description:
            "Updates the ENA Express configuration for the network interface that’s attached to the instance.",
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
        EnablePrimaryIpv6: {
          name: "Enable Primary Ipv6",
          description:
            "If you’re modifying a network interface in a dual-stack or IPv6-only subnet, you have the option to assign a primary IPv6 IP address.",
          type: "boolean",
          required: false,
        },
        ConnectionTrackingSpecification: {
          name: "Connection Tracking Specification",
          description: "A connection tracking specification.",
          type: {
            type: "object",
            properties: {
              TcpEstablishedTimeout: {
                type: "number",
              },
              UdpStreamTimeout: {
                type: "number",
              },
              UdpTimeout: {
                type: "number",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        AssociatePublicIpAddress: {
          name: "Associate Public Ip Address",
          description:
            "Indicates whether to assign a public IPv4 address to a network interface.",
          type: "boolean",
          required: false,
        },
        AssociatedSubnetIds: {
          name: "Associated Subnet Ids",
          description:
            "A list of subnet IDs to associate with the network interface.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
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
        Description: {
          name: "Description",
          description: "A description for the network interface.",
          type: {
            type: "object",
            properties: {
              Value: {
                type: "string",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        SourceDestCheck: {
          name: "Source Dest Check",
          description:
            "Enable or disable source/destination checks, which ensure that the instance is either the source or the destination of any traffic that it receives.",
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
        Groups: {
          name: "Groups",
          description: "Changes the security groups for the network interface.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        Attachment: {
          name: "Attachment",
          description: "Information about the interface attachment.",
          type: {
            type: "object",
            properties: {
              DefaultEnaQueueCount: {
                type: "boolean",
              },
              EnaQueueCount: {
                type: "number",
              },
              AttachmentId: {
                type: "string",
              },
              DeleteOnTermination: {
                type: "boolean",
              },
            },
            additionalProperties: false,
          },
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

        const command = new ModifyNetworkInterfaceAttributeCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Network Interface Attribute Result",
      description: "Result from ModifyNetworkInterfaceAttribute operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default modifyNetworkInterfaceAttribute;
