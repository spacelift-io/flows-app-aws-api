import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DisableVgwRoutePropagationCommand,
} from "@aws-sdk/client-ec2";

const disableVgwRoutePropagation: AppBlock = {
  name: "Disable Vgw Route Propagation",
  description:
    "Disables a virtual private gateway (VGW) from propagating routes to a specified route table of a VPC.",
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
          description: "The ID of the virtual private gateway.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new DisableVgwRoutePropagationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Disable Vgw Route Propagation Result",
      description: "Result from DisableVgwRoutePropagation operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default disableVgwRoutePropagation;
