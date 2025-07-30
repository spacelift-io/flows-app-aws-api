import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  SearchTransitGatewayRoutesCommand,
} from "@aws-sdk/client-ec2";

const searchTransitGatewayRoutes: AppBlock = {
  name: "Search Transit Gateway Routes",
  description:
    "Searches for routes in the specified transit gateway route table.",
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
        Filters: {
          name: "Filters",
          description: "One or more filters.",
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
          required: true,
        },
        MaxResults: {
          name: "Max Results",
          description: "The maximum number of routes to return.",
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

        const command = new SearchTransitGatewayRoutesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Search Transit Gateway Routes Result",
      description: "Result from SearchTransitGatewayRoutes operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Routes: {
            type: "array",
            items: {
              type: "object",
              properties: {
                DestinationCidrBlock: {
                  type: "string",
                },
                PrefixListId: {
                  type: "string",
                },
                TransitGatewayRouteTableAnnouncementId: {
                  type: "string",
                },
                TransitGatewayAttachments: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      ResourceId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      TransitGatewayAttachmentId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      ResourceType: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                Type: {
                  type: "string",
                },
                State: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "Information about the routes.",
          },
          AdditionalRoutesAvailable: {
            type: "boolean",
            description:
              "Indicates whether there are additional routes available.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default searchTransitGatewayRoutes;
