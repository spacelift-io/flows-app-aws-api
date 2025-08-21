import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  ReplaceRouteTableAssociationCommand,
} from "@aws-sdk/client-ec2";

const replaceRouteTableAssociation: AppBlock = {
  name: "Replace Route Table Association",
  description:
    "Changes the route table associated with a given subnet, internet gateway, or virtual private gateway in a VPC.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
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
        AssociationId: {
          name: "Association Id",
          description: "The association ID.",
          type: "string",
          required: true,
        },
        RouteTableId: {
          name: "Route Table Id",
          description:
            "The ID of the new route table to associate with the subnet.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new ReplaceRouteTableAssociationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Replace Route Table Association Result",
      description: "Result from ReplaceRouteTableAssociation operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NewAssociationId: {
            type: "string",
            description: "The ID of the new association.",
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

export default replaceRouteTableAssociation;
