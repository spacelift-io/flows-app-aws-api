import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DeleteTransitGatewayRouteCommand,
} from "@aws-sdk/client-ec2";

const deleteTransitGatewayRoute: AppBlock = {
  name: "Delete Transit Gateway Route",
  description:
    "Deletes the specified route from the specified transit gateway route table.",
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
        DestinationCidrBlock: {
          name: "Destination Cidr Block",
          description: "The CIDR range for the route.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new DeleteTransitGatewayRouteCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Transit Gateway Route Result",
      description: "Result from DeleteTransitGatewayRoute operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Route: {
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
                      type: "string",
                    },
                    TransitGatewayAttachmentId: {
                      type: "string",
                    },
                    ResourceType: {
                      type: "string",
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
            description: "Information about the route.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteTransitGatewayRoute;
