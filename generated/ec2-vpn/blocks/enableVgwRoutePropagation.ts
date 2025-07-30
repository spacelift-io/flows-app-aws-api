import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  EnableVgwRoutePropagationCommand,
} from "@aws-sdk/client-ec2";

const enableVgwRoutePropagation: AppBlock = {
  name: "Enable Vgw Route Propagation",
  description:
    "Enables a virtual private gateway (VGW) to propagate routes to the specified route table of a VPC.",
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
            "The ID of the virtual private gateway that is attached to a VPC.",
          type: "string",
          required: true,
        },
        RouteTableId: {
          name: "Route Table Id",
          description: "The ID of the route table.",
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

        const command = new EnableVgwRoutePropagationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Enable Vgw Route Propagation Result",
      description: "Result from EnableVgwRoutePropagation operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default enableVgwRoutePropagation;
