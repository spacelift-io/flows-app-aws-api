import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  EnableTransitGatewayRouteTablePropagationCommand,
} from "@aws-sdk/client-ec2";

const enableTransitGatewayRouteTablePropagation: AppBlock = {
  name: "Enable Transit Gateway Route Table Propagation",
  description:
    "Enables the specified attachment to propagate routes to the specified propagation route table.",
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
          description: "The ID of the propagation route table.",
          type: "string",
          required: true,
        },
        TransitGatewayAttachmentId: {
          name: "Transit Gateway Attachment Id",
          description: "The ID of the attachment.",
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
        TransitGatewayRouteTableAnnouncementId: {
          name: "Transit Gateway Route Table Announcement Id",
          description:
            "The ID of the transit gateway route table announcement.",
          type: "string",
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

        const command = new EnableTransitGatewayRouteTablePropagationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Enable Transit Gateway Route Table Propagation Result",
      description:
        "Result from EnableTransitGatewayRouteTablePropagation operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Propagation: {
            type: "object",
            properties: {
              TransitGatewayAttachmentId: {
                type: "string",
              },
              ResourceId: {
                type: "string",
              },
              ResourceType: {
                type: "string",
              },
              TransitGatewayRouteTableId: {
                type: "string",
              },
              State: {
                type: "string",
              },
              TransitGatewayRouteTableAnnouncementId: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "Information about route propagation.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default enableTransitGatewayRouteTablePropagation;
