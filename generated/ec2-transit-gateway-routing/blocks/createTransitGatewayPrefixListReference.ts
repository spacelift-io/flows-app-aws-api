import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  CreateTransitGatewayPrefixListReferenceCommand,
} from "@aws-sdk/client-ec2";

const createTransitGatewayPrefixListReference: AppBlock = {
  name: "Create Transit Gateway Prefix List Reference",
  description:
    "Creates a reference (route) to a prefix list in a specified transit gateway route table.",
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
        PrefixListId: {
          name: "Prefix List Id",
          description:
            "The ID of the prefix list that is used for destination matches.",
          type: "string",
          required: true,
        },
        TransitGatewayAttachmentId: {
          name: "Transit Gateway Attachment Id",
          description: "The ID of the attachment to which traffic is routed.",
          type: "string",
          required: false,
        },
        Blackhole: {
          name: "Blackhole",
          description:
            "Indicates whether to drop traffic that matches this route.",
          type: "boolean",
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

        const command = new CreateTransitGatewayPrefixListReferenceCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Transit Gateway Prefix List Reference Result",
      description:
        "Result from CreateTransitGatewayPrefixListReference operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TransitGatewayPrefixListReference: {
            type: "object",
            properties: {
              TransitGatewayRouteTableId: {
                type: "string",
              },
              PrefixListId: {
                type: "string",
              },
              PrefixListOwnerId: {
                type: "string",
              },
              State: {
                type: "string",
              },
              Blackhole: {
                type: "boolean",
              },
              TransitGatewayAttachment: {
                type: "object",
                properties: {
                  TransitGatewayAttachmentId: {
                    type: "string",
                  },
                  ResourceType: {
                    type: "string",
                  },
                  ResourceId: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
            },
            additionalProperties: false,
            description: "Information about the prefix list reference.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createTransitGatewayPrefixListReference;
