import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  RejectTransitGatewayMulticastDomainAssociationsCommand,
} from "@aws-sdk/client-ec2";

const rejectTransitGatewayMulticastDomainAssociations: AppBlock = {
  name: "Reject Transit Gateway Multicast Domain Associations",
  description:
    "Rejects a request to associate cross-account subnets with a transit gateway multicast domain.",
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
          required: false,
        },
        TransitGatewayAttachmentId: {
          name: "Transit Gateway Attachment Id",
          description: "The ID of the transit gateway attachment.",
          type: "string",
          required: false,
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

        const command =
          new RejectTransitGatewayMulticastDomainAssociationsCommand(
            commandInput as any,
          );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Reject Transit Gateway Multicast Domain Associations Result",
      description:
        "Result from RejectTransitGatewayMulticastDomainAssociations operation",
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
            description: "Information about the multicast domain associations.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default rejectTransitGatewayMulticastDomainAssociations;
