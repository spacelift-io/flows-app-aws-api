import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, AssociateRouteTableCommand } from "@aws-sdk/client-ec2";

const associateRouteTable: AppBlock = {
  name: "Associate Route Table",
  description:
    "Associates a subnet in your VPC or an internet gateway or virtual private gateway attached to your VPC with a route table in your VPC.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        GatewayId: {
          name: "Gateway Id",
          description:
            "The ID of the internet gateway or virtual private gateway.",
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
        SubnetId: {
          name: "Subnet Id",
          description: "The ID of the subnet.",
          type: "string",
          required: false,
        },
        RouteTableId: {
          name: "Route Table Id",
          description: "The ID of the route table.",
          type: "string",
          required: true,
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

        const command = new AssociateRouteTableCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Associate Route Table Result",
      description: "Result from AssociateRouteTable operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          AssociationId: {
            type: "string",
            description: "The route table association ID.",
          },
          AssociationState: {
            type: "object",
            properties: {
              State: {
                type: "string",
              },
              StatusMessage: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "The state of the association.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default associateRouteTable;
