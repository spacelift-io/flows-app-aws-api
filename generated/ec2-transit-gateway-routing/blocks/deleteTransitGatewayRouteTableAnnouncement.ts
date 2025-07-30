import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DeleteTransitGatewayRouteTableAnnouncementCommand,
} from "@aws-sdk/client-ec2";

const deleteTransitGatewayRouteTableAnnouncement: AppBlock = {
  name: "Delete Transit Gateway Route Table Announcement",
  description:
    "Advertises to the transit gateway that a transit gateway route table is deleted.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TransitGatewayRouteTableAnnouncementId: {
          name: "Transit Gateway Route Table Announcement Id",
          description:
            "The transit gateway route table ID that's being deleted.",
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
        });

        const command = new DeleteTransitGatewayRouteTableAnnouncementCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Transit Gateway Route Table Announcement Result",
      description:
        "Result from DeleteTransitGatewayRouteTableAnnouncement operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TransitGatewayRouteTableAnnouncement: {
            type: "object",
            properties: {
              TransitGatewayRouteTableAnnouncementId: {
                type: "string",
              },
              TransitGatewayId: {
                type: "string",
              },
              CoreNetworkId: {
                type: "string",
              },
              PeerTransitGatewayId: {
                type: "string",
              },
              PeerCoreNetworkId: {
                type: "string",
              },
              PeeringAttachmentId: {
                type: "string",
              },
              AnnouncementDirection: {
                type: "string",
              },
              TransitGatewayRouteTableId: {
                type: "string",
              },
              State: {
                type: "string",
              },
              CreationTime: {
                type: "string",
              },
              Tags: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Key: {
                      type: "string",
                    },
                    Value: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
            },
            additionalProperties: false,
            description:
              "Provides details about a deleted transit gateway route table.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteTransitGatewayRouteTableAnnouncement;
