import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DisassociateTransitGatewayPolicyTableCommand,
} from "@aws-sdk/client-ec2";

const disassociateTransitGatewayPolicyTable: AppBlock = {
  name: "Disassociate Transit Gateway Policy Table",
  description:
    "Removes the association between an an attachment and a policy table.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TransitGatewayPolicyTableId: {
          name: "Transit Gateway Policy Table Id",
          description: "The ID of the disassociated policy table.",
          type: "string",
          required: true,
        },
        TransitGatewayAttachmentId: {
          name: "Transit Gateway Attachment Id",
          description:
            "The ID of the transit gateway attachment to disassociate from the policy table.",
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

        const command = new DisassociateTransitGatewayPolicyTableCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Disassociate Transit Gateway Policy Table Result",
      description:
        "Result from DisassociateTransitGatewayPolicyTable operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Association: {
            type: "object",
            properties: {
              TransitGatewayPolicyTableId: {
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
            description:
              "Returns details about the transit gateway policy table disassociation.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default disassociateTransitGatewayPolicyTable;
