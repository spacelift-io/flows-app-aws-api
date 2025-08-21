import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DeleteTransitGatewayRouteTableCommand,
} from "@aws-sdk/client-ec2";

const deleteTransitGatewayRouteTable: AppBlock = {
  name: "Delete Transit Gateway Route Table",
  description: "Deletes the specified transit gateway route table.",
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

        const command = new DeleteTransitGatewayRouteTableCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Transit Gateway Route Table Result",
      description: "Result from DeleteTransitGatewayRouteTable operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TransitGatewayRouteTable: {
            type: "object",
            properties: {
              TransitGatewayRouteTableId: {
                type: "string",
              },
              TransitGatewayId: {
                type: "string",
              },
              State: {
                type: "string",
              },
              DefaultAssociationRouteTable: {
                type: "boolean",
              },
              DefaultPropagationRouteTable: {
                type: "boolean",
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
              "Information about the deleted transit gateway route table.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteTransitGatewayRouteTable;
