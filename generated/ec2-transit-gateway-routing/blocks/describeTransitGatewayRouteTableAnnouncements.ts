import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeTransitGatewayRouteTableAnnouncementsCommand,
} from "@aws-sdk/client-ec2";

const describeTransitGatewayRouteTableAnnouncements: AppBlock = {
  name: "Describe Transit Gateway Route Table Announcements",
  description:
    "Describes one or more transit gateway route table advertisements.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TransitGatewayRouteTableAnnouncementIds: {
          name: "Transit Gateway Route Table Announcement Ids",
          description:
            "The IDs of the transit gateway route tables that are being advertised.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        Filters: {
          name: "Filters",
          description:
            "The filters associated with the transit gateway policy table.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: {
                  type: "string",
                },
                Values: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              additionalProperties: false,
            },
          },
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of results to return with a single call.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token for the next page of results.",
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

        const command =
          new DescribeTransitGatewayRouteTableAnnouncementsCommand(
            commandInput as any,
          );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Transit Gateway Route Table Announcements Result",
      description:
        "Result from DescribeTransitGatewayRouteTableAnnouncements operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TransitGatewayRouteTableAnnouncements: {
            type: "array",
            items: {
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
            description:
              "Describes the transit gateway route table announcement.",
          },
          NextToken: {
            type: "string",
            description: "The token for the next page of results.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeTransitGatewayRouteTableAnnouncements;
