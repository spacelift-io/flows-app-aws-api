import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DeleteTransitGatewayPrefixListReferenceCommand,
} from "@aws-sdk/client-ec2";

const deleteTransitGatewayPrefixListReference: AppBlock = {
  name: "Delete Transit Gateway Prefix List Reference",
  description:
    "Deletes a reference (route) to a prefix list in a specified transit gateway route table.",
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
          description: "The ID of the route table.",
          type: "string",
          required: true,
        },
        PrefixListId: {
          name: "Prefix List Id",
          description: "The ID of the prefix list.",
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

        const command = new DeleteTransitGatewayPrefixListReferenceCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Transit Gateway Prefix List Reference Result",
      description:
        "Result from DeleteTransitGatewayPrefixListReference operation",
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
            description: "Information about the deleted prefix list reference.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteTransitGatewayPrefixListReference;
