import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  AssociateTransitGatewayMulticastDomainCommand,
} from "@aws-sdk/client-ec2";

const associateTransitGatewayMulticastDomain: AppBlock = {
  name: "Associate Transit Gateway Multicast Domain",
  description:
    "Associates the specified subnets and transit gateway attachments with the specified transit gateway multicast domain.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TransitGatewayMulticastDomainId: {
          name: "Transit Gateway Multicast Domain Id",
          description: "The ID of the transit gateway multicast domain.",
          type: "string",
          required: true,
        },
        TransitGatewayAttachmentId: {
          name: "Transit Gateway Attachment Id",
          description:
            "The ID of the transit gateway attachment to associate with the transit gateway multicast domain.",
          type: "string",
          required: true,
        },
        SubnetIds: {
          name: "Subnet Ids",
          description:
            "The IDs of the subnets to associate with the transit gateway multicast domain.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
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

        const command = new AssociateTransitGatewayMulticastDomainCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Associate Transit Gateway Multicast Domain Result",
      description:
        "Result from AssociateTransitGatewayMulticastDomain operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Associations: {
            type: "object",
            properties: {
              TransitGatewayMulticastDomainId: {
                type: "string",
              },
              TransitGatewayAttachmentId: {
                type: "string",
              },
              ResourceId: {
                type: "string",
              },
              ResourceType: {
                type: "string",
              },
              ResourceOwnerId: {
                type: "string",
              },
              Subnets: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    SubnetId: {
                      type: "string",
                    },
                    State: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
            },
            additionalProperties: false,
            description:
              "Information about the transit gateway multicast domain associations.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default associateTransitGatewayMulticastDomain;
