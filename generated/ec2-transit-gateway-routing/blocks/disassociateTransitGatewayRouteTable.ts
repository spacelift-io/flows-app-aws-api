import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DisassociateTransitGatewayRouteTableCommand,
} from "@aws-sdk/client-ec2";

const disassociateTransitGatewayRouteTable: AppBlock = {
  name: "Disassociate Transit Gateway Route Table",
  description:
    "Disassociates a resource attachment from a transit gateway route table.",
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
        TransitGatewayAttachmentId: {
          name: "Transit Gateway Attachment Id",
          description: "The ID of the attachment.",
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

        const command = new DisassociateTransitGatewayRouteTableCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Disassociate Transit Gateway Route Table Result",
      description: "Result from DisassociateTransitGatewayRouteTable operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Association: {
            type: "object",
            properties: {
              TransitGatewayRouteTableId: {
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
              State: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "Information about the association.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default disassociateTransitGatewayRouteTable;
