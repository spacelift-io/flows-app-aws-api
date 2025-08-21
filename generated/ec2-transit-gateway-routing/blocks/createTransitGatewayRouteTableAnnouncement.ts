import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  CreateTransitGatewayRouteTableAnnouncementCommand,
} from "@aws-sdk/client-ec2";

const createTransitGatewayRouteTableAnnouncement: AppBlock = {
  name: "Create Transit Gateway Route Table Announcement",
  description: "Advertises a new transit gateway route table.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TransitGatewayRouteTableId: {
          name: "Transit Gateway Route Table Id",
          description: "The ID of the transit gateway route table.",
          type: "string",
          required: true,
        },
        PeeringAttachmentId: {
          name: "Peering Attachment Id",
          description: "The ID of the peering attachment.",
          type: "string",
          required: true,
        },
        TagSpecifications: {
          name: "Tag Specifications",
          description:
            "The tags specifications applied to the transit gateway route table announcement.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ResourceType: {
                  type: "string",
                },
                Tags: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Key: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Value: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
              },
              additionalProperties: false,
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new CreateTransitGatewayRouteTableAnnouncementCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Transit Gateway Route Table Announcement Result",
      description:
        "Result from CreateTransitGatewayRouteTableAnnouncement operation",
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
              "Provides details about the transit gateway route table announcement.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createTransitGatewayRouteTableAnnouncement;
